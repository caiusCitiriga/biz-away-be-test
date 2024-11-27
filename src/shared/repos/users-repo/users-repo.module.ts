import { Module } from '@nestjs/common';
import { UsersRepoService } from './users-repo.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';

@Module({
  exports: [UsersRepoService],
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UsersRepoService],
})
export class UsersRepoModule {}
