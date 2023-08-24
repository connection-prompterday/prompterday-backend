import { Module } from '@nestjs/common';

import { CustomConfigModule } from './common/modules/config-module';
import { ChatGptModule } from './chat-gpt/chat-gpt.module';

@Module({
  imports: [CustomConfigModule, ChatGptModule],
})
export class AppModule {}
