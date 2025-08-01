from django.urls import path

from caffe.views import ListCoffeeView, AddCoffeeView, GetCoffeById, BuyCoffeeView, CoffeUpdateView, DeleteCoffeeView

urlpatterns = [
    path('allcoffes/', ListCoffeeView.as_view(), name='list-coffee'),
    path('addcoffe/' , AddCoffeeView.as_view(), name='add-new-coffee'),
    path('coffe/<int:id>/', GetCoffeById.as_view(), name='get-coffe'),
    path('buycaffe/', BuyCoffeeView.as_view(), name='add-coffee'),
    path('update-coffee/<int:pk>/', CoffeUpdateView.as_view(), name='update-coffee'),
    path('delete-coffe/<int:pk>/', DeleteCoffeeView.as_view(), name='delete-coffee'),
]