import { Body, Controller, Get, Param, Post, Query, Request, UseGuards } from "@nestjs/common"

import { UserService } from "./user.service"
import { AuthGuard } from "#models/auth/auth.guard"
import { CreateUserDto } from "./dto/create-user.dto"
import { IUser } from "#interfaces/user"
import { FindUsersDto } from "./dto/find-users.dto"

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("search")
  @UseGuards(AuthGuard)
  findUsers(@Query() query: FindUsersDto) {
    return this.userService.findUsers(query)
  }

  @Get(":userIdentifier")
  @UseGuards(AuthGuard)
  findUser(
    @Request()
    req: { userId: IUser["id"] },
    @Param("userIdentifier")
    userIdentifier: string
  ) {
    return this.userService.findUser({ loggedInUserId: req.userId, userIdentifier })
  }

  @Post()
  createUser(
    @Body()
    createUserDto: CreateUserDto
  ) {
    return this.userService.createUser(createUserDto)
  }

  // @Patch(':id')
  // updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  // 	return this.userService.updateUser(+id, updateUserDto)
  // }

  // @Delete(':id')
  // deleteUser(@Param('id') id: string) {
  // 	return this.userService.deleteUser(+id)
  // }

  // @Query(() => UserDto)
  // @UseGuards(new AuthGuard())
  // me(
  // 	@Context('user')
  // 	{ id }: IUser,
  // ) {
  // 	return this.userService.getUser({ id })
  // }

  // @Get("me")
  // @UseGuards(AuthGuard)
  // getCurrentUserData(
  //   @Request()
  //   req: any // eslint-disable-line @typescript-eslint/no-explicit-any
  // ) {
  //   return this.userService.getUser({ id: req.userId })
  // }
}
