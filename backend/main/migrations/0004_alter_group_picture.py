# Generated by Django 5.0.7 on 2024-07-31 12:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0003_alter_group_picture'),
    ]

    operations = [
        migrations.AlterField(
            model_name='group',
            name='picture',
            field=models.ImageField(default='default_group_pic/default_group_pic.png', max_length=500, upload_to='group_pictures/'),
        ),
    ]
