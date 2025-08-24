from datetime import datetime

from rest_framework import serializers

from caffe.models import Coffee
from userapp.models import ClientHistory
from userapp.serializers import SellerProfileSerializer, UserSerializer


class AddNewCoffeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coffee
        fields = ['name', 'description', 'price', 'type', 'image']
    
    def validate_name(self, value):
        if len(value.strip()) < 4:
            raise serializers.ValidationError("Name must be 4 characters or more.")
        return value.strip()
    
    def validate_description(self, value):
        if len(value.strip()) < 10:
            raise serializers.ValidationError("Description must be 10 characters or more.")
        return value.strip()
    
    def validate_price(self, value):
        if value <= 0:
            raise serializers.ValidationError("Price must be greater than $0.")
        if value > 1000:
            raise serializers.ValidationError("Price seems too high. Please check the value.")
        return value
    def validate_type(self, value):
        valid_types = [
            'coffee' , 'tea' , 'milk' , 'cookie',
            'sandwitch' , 'food' , 'chocolate', 'cake',
            'icecream'
        ]
        if value.lower() not in valid_types:
            raise serializers.ValidationError(
                f"Enter a valid type. Valid options: {', '.join(valid_types)}"
            )
        return value.lower()

class BuyCoffeSerializer(serializers.Serializer):

    caffe_name = serializers.CharField(required=True)
    caffe_description = serializers.CharField(required=True)
    caffe_price = serializers.IntegerField(required=True)
    caffe_type = serializers.CharField(required=True)
    quantity = serializers.IntegerField(required=True)
    available = serializers.IntegerField(required=True)

    def validate_caffe_name(self, value):
        if not Coffee.objects.filter(name=value).exists():
            raise serializers.ValidationError("Coffee does not exist.")
        return value

    def create(self, validated_data):
        name = validated_data['caffe_name']
        description = validated_data['caffe_description']
        price = validated_data['caffe_price']
        type = validated_data['caffe_type']
        quantity = validated_data['quantity']
        available = validated_data['available']
        user = self.context['request'].user

        if available:

            ClientHistory.objects.create(
                user = user,
                action = 'buy a coffee',
                description = f'{user.full_name}bought {name} {quantity}{description} {price} {type}',
                date = datetime.now(),

            )

            return {
                'message': f"Successfully bought {name} x {description}.",
                'coffee_name': name,
                'client_id': user.id,
            }


class CoffeeUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coffee
        fields = ['name', 'type', 'description', 'price' , 'available']




class CoffeSerializer(serializers.ModelSerializer):
    added_by = UserSerializer()

    class Meta:
        model = Coffee
        fields = '__all__'


class SearchCoffeSerializer(serializers.ModelSerializer):
    name = serializers.CharField(required=False)
    type = serializers.CharField(required=False)
    address = serializers.CharField(required=False)
    added_by = UserSerializer(required=False)

    class Meta:
        model = Coffee
        fields = "__all__"




