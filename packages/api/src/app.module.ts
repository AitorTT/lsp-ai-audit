import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerModule, ThrottlerGuard } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";
import { configuration } from "./config/configuration";
import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";
import { ClientsModule } from "./modules/clients/clients.module";
import { AuditsModule } from "./modules/audits/audits.module";
import { ReportsModule } from "./modules/reports/reports.module";
import { FilesModule } from "./modules/files/files.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    AuthModule,
    UsersModule,
    ClientsModule,
    AuditsModule,
    ReportsModule,
    FilesModule,
  ],
})
export class AppModule {}
