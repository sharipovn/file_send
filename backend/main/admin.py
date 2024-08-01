from django.contrib import admin
from .models import User,Group,File,Profile

admin.site.register(User)
admin.site.register(Group)
admin.site.register(File)
admin.site.register(Profile)
