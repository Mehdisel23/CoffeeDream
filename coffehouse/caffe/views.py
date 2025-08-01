from gc import get_objects

from django.core.cache import cache
from django.shortcuts import render
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from rest_framework import permissions, status
from rest_framework.generics import CreateAPIView, ListAPIView, RetrieveAPIView, UpdateAPIView, get_object_or_404
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.views import APIView

from caffe.models import Coffee
from caffe.serializers import AddNewCoffeSerializer, CoffeSerializer, BuyCoffeSerializer
from userapp.permissions import IsSellerPermission, IsAdminPermission, IsClientPermission


# Create your views here.
class AddCoffeeView(CreateAPIView):
    serializer_class = AddNewCoffeSerializer
    permission_classes = [IsSellerPermission]
    parser_classes = [MultiPartParser, FormParser]

    def perform_create(self, serializer):
        # This is where we assign the user - not in the serializer
        serializer.save(added_by=self.request.user)

    def create(self, request, *args, **kwargs):
        # Additional check to ensure user is authenticated
        if not request.user.is_authenticated:
            return Response(
                {
                    'message': 'Authentication required',
                    'error': 'You must be logged in to add coffee items.'
                },
                status=status.HTTP_401_UNAUTHORIZED
            )

        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            # Call perform_create explicitly to set the user
            self.perform_create(serializer)
            response_serializer = CoffeSerializer(serializer.instance)

            #clear the cache to reload again
            self.clear_coffee_cache()

            return Response(
                {
                    'message': 'Coffee added successfully!',
                    'coffee': response_serializer.data
                },
                status=status.HTTP_201_CREATED
            )
        return Response(
            {
                'message': 'Validation failed',
                'errors': serializer.errors
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    def clear_coffee_cache(self):
        """Clear all coffee list cache pages"""
        try:
            # Clear Redis cache - adjust range based on your expected max pages
            for page in range(1, 21):  # Clear up to 20 pages
                cache_key = f"coffeList_page_{page}"
                cache.delete(cache_key)

            print("✅ Coffee cache cleared after adding new item")
        except Exception as e:
            print(f"❌ Error clearing cache: {e}")


'''@method_decorator(cache_page(60*5) , name='dispatch')
class ListCoffeeView(ListAPIView):
    serializer_class = CoffeSerializer

    def get_queryset(self):
        return Coffee.objects.all()'''


class ListCoffeeView(ListAPIView):
    serializer_class = CoffeSerializer

    def get_queryset(self):
        # Try to get from cache first
        cached_data = cache.get('coffee')
        if cached_data:
            return cached_data

        # Otherwise, fetch from DB and cache it
        queryset = Coffee.objects.all()
        cache.set('coffee', queryset, 60 * 5)  # Cache for 5 minutes
        return queryset



class GetCoffeById(APIView):
    serializer_class = CoffeSerializer
    permission_classes = [IsAdminPermission]

    def get(self , request, id):

        coffe = Coffee.objects.get(id=id)

        serializer = CoffeSerializer(coffe)
        return Response({
            'message': 'Coffee retrieved successfully',
            'data': serializer.data
        }, status=status.HTTP_200_OK)


class BuyCoffeeView(APIView):

    permission_classes = [IsClientPermission]

    def post(self, request ):
        serializer = BuyCoffeSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            response = serializer.save()
            return Response(response, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CoffeUpdateView(UpdateAPIView):

    permission_classes = [IsSellerPermission]

    def put(self, request , pk ):
        coffe = get_object_or_404(Coffee, pk=pk)
        serializer = CoffeUpdateView(coffe=coffe, data=request.data)

        if not serializer.is_valid():
            return Response({
                'message': 'Validation failed',
            })
        serializer.save()
        return Response(serializer.data)



class DeleteCoffeeView(APIView):
    permission_classes = [IsSellerPermission]
    def delete(self, request , pk ):
        try:
            coffee = get_object_or_404(Coffee, pk=pk)
            coffee.delete()

            for page in range(1 , 2):  # N = total number of pages if you know it
                cache_key = f"coffeList_page_{page}"
                cache.delete(cache_key)


            return Response({"message": "Coffee deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Coffee.DoesNotExist:
            return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)

