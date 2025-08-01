from django.db import models

from userapp.models import User


# Create your models here.
class Coffee(models.Model):
    name = models.CharField(max_length=100)
    image = models.ImageField(upload_to='coffe/', blank=True, null=True)
    type = models.CharField(max_length=100)
    added_by = models.ForeignKey(User, on_delete=models.CASCADE)
    description = models.TextField()
    price = models.FloatField()
    available = models.BooleanField(blank=True, default=True)

    class Meta:
        db_table = 'coffee'

    def __str__(self):
        return self.name