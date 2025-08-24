from django.contrib import admin

from caffe.models import Coffee
from userapp.models import User, ClientHistory, Seller

# Register your models here.
admin.site.register(User)
admin.site.register(Seller)
admin.site.register(ClientHistory)