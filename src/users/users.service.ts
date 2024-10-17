import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto) {
    try {
      return await new this.userModel(createUserDto).save();
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Email must be unique');
      }
      throw error;
    }
  }

  findAll() {
    return this.userModel.find();
  }

  async findOne(id: string) {
    try {
      return await this.userModel.findById(id).populate('expenses', '-user');
    } catch (error) {
      if (error)
        throw new NotFoundException(
          'Not found. Id is incorrect or user does not exist',
        );
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      return await this.userModel.findByIdAndUpdate(id, updateUserDto, {
        new: true,
      });
    } catch (error) {
      if (error)
        throw new NotFoundException(
          'Not found. Id is incorrect or user does not exist',
        );
    }
  }

  async remove(id: string) {
    try {
      const deletedUser = this.userModel.findByIdAndDelete(id);
      return deletedUser;
    } catch (error) {
      if (error)
        throw new NotFoundException(
          'Not found. Id is incorrect or user already deleted',
        );
    }
  }

  async addPost(userId: string, postId) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException();
    user.expenses.push(postId);
    const updateUser = await this.userModel.findByIdAndUpdate(userId, user, {
      new: true,
    });
    return updateUser;
  }
}
