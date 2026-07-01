from django.db import models

class WeatherSearch(models.Model):
    location = models.CharField(max_length=255)
    country = models.CharField(max_length=100, blank=True)
    temperature = models.FloatField()
    feels_like = models.FloatField()
    humidity = models.IntegerField()
    wind_speed = models.FloatField()
    description = models.CharField(max_length=255)
    icon = models.CharField(max_length=50)
    date_from = models.DateField(null=True, blank=True)
    date_to = models.DateField(null=True, blank=True)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    searched_at = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True)

    class Meta:
        ordering = ['-searched_at']

    def __str__(self):
        return f"{self.location} - {self.searched_at.strftime('%Y-%m-%d %H:%M')}"