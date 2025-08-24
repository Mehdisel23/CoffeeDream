from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone


# Create your models here.
class User(AbstractUser):
    ROLES_TYPES = (
        ('admin', 'admin'),
        ('client', 'client'),
        ('seller', 'seller'),
    )
    role = models.CharField(max_length=10, choices=ROLES_TYPES, default='client')
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=100)
    email_confirmed = models.BooleanField(default=False)
    verification_token = models.CharField(max_length=100, blank=True, null=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    class Meta:
        db_table = 'usersapp'

    @property
    def is_admin(self):
        return self.role == 'admin' or self.is_superuser

    @property
    def is_client(self):
        return self.role == 'client'

    @property
    def is_seller(self):
        return self.role == 'seller'


class ClientHistory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE , related_name='client_histories')
    action = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    date = models.DateTimeField(default=timezone.now)


    class Meta:
        db_table = 'clienthistories'
        ordering = ['-date']

class Seller(models.Model):
    user= models.OneToOneField(User, on_delete=models.CASCADE , related_name='seller')
    phone_number = models.CharField(blank = True , max_length=20)
    description = models.TextField(blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='seller/', blank=True, null=True)
    rating = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)


    class Meta:
        db_table = 'sellers'

    def __str__(self):
        return f"{self.user.full_name}-{self.description}"
