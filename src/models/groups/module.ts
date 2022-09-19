import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

import { GroupsSubjectsModule } from "#models/groups-subjects/module"

import { GroupsController } from "./controller"
import { GroupEntity } from "./entities/group.entity"
import { GroupsService } from "./service"

@Module({
  exports: [GroupsService],
  imports: [TypeOrmModule.forFeature([GroupEntity]), GroupsSubjectsModule],
  providers: [GroupsController, GroupsService],
  controllers: [GroupsController],
})
export class GroupsModule {}
