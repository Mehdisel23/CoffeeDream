from django.urls import path

from caffe.views import ListCoffeeView, AddCoffeeView, GetCoffeById, BuyCoffeeView, CoffeUpdateView, DeleteCoffeeView, \
    GetAddedCoffeeBySellerView, SearchCoffeeView

urlpatterns = [
    path('allcoffes/', ListCoffeeView.as_view(), name='list-coffee'),
    path('addcoffe/' , AddCoffeeView.as_view(), name='add-new-coffee'),
    path('coffee/<int:id>/', GetCoffeById.as_view(), name='get-coffe'),
    path('buycaffe/', BuyCoffeeView.as_view(), name='add-coffee'),
    path('update-coffee/<int:pk>/', CoffeUpdateView.as_view(), name='update-coffee'),
    path('delete-coffe/<int:pk>/', DeleteCoffeeView.as_view(), name='delete-coffee'),
    path('profile/coffee-peruser/' , GetAddedCoffeeBySellerView.as_view() , name='get-coffee-peruser'),
    path('coffee/search/' , SearchCoffeeView.as_view(), name='search-coffee'),


]