import uuid
from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    def __str__(self):
        return self.username

    class  Meta:
        db_table = 'User'
        managed = True

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    profile_pic = models.ImageField(upload_to='profile_pics/',default='default_profile_pic/default.png')

    def __str__(self):
        return f'{self.user.username} Profile'

    class Meta:
        db_table = 'Profile'
        managed = True
        

class Group(models.Model):
    group_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    picture = models.ImageField(upload_to='group_pictures/', default='default_group_pic/default_group_pic.png',max_length=500)
    created = models.DateTimeField(auto_now_add=True)
    members = models.ManyToManyField(User, related_name='user_groups')
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_groups', null=True, blank=True)

    def save(self, *args, **kwargs):

        if not self.creator and self.pk:
            first_member = self.members.first()
            if first_member:
                self.creator = first_member
        super().save(*args, **kwargs)

    def __str__(self):
        return str(self.name) +' ' + str(self.creator)

    class Meta:
        db_table = 'Group'
        managed = True
        
        
class File(models.Model):
    file_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    file_name = models.CharField(max_length=255)
    file = models.FileField(upload_to='uploaded_files/%Y/%m/%d/')
    comment = models.TextField(null=True, blank=True)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    who_can_see = models.ManyToManyField(User, related_name='files', blank=True)
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_files')

    def save(self, *args, **kwargs):
        # Save the instance first
        super().save(*args, **kwargs)
        
        # Ensure sender is in who_can_see if it's not already there
        if self.sender and not self.who_can_see.filter(id=self.sender.id).exists():
            self.who_can_see.add(self.sender)
            # Save the instance again to apply the changes to the ManyToManyField
            super().save(*args, **kwargs)

    def __str__(self):
        return self.file_name

    def file_size(self):
        size = self.file.size
        if size < 1024:
            return f"{size} bytes"
        elif size < 1024 ** 2:
            return f"{size / 1024:.2f} KB"
        elif size < 1024 ** 3:
            return f"{size / (1024 ** 2):.2f} MB"
        else:
            return f"{size / (1024 ** 3):.2f} GB"
    
    class Meta:
        db_table = 'File'
        managed = True
        ordering = ['-created']