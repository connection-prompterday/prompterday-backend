import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from 'openai';
import { GetAdviseDto } from './dto/get-advise.dto';
import { NutritionistResponse } from './interface/interface';

@Injectable()
export class ChatGptService {
  private openAi: OpenAIApi;
  private nutritionistSystemSetup: string;
  private nutritionistUserSetup: string;
  private nutritionistAssistantSetup: string;

  constructor(private readonly configService: ConfigService) {
    const configuration = new Configuration({
      apiKey: configService.get<string>('OPENAI_SECRET_KEY'),
    });

    this.openAi = new OpenAIApi(configuration);

    this.nutritionistSystemSetup = configService.get<string>(
      'NUTRITIONIST_SYSTEM_SETUP',
    );
    this.nutritionistUserSetup = configService.get<string>(
      'NUTRITIONIST_USER_SETUP',
    );
    this.nutritionistAssistantSetup = configService.get<string>(
      'NUTRITIONIST_ASSISTANT_SETUP',
    );
  }

  async getAdviseFromNutritionist(
    getAdviseDto: GetAdviseDto,
  ): Promise<NutritionistResponse[]> {
    const messages = this.createNutritionistRequestMessages(getAdviseDto);

    try {
      const response = await this.openAi.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: messages,
        temperature: 0,
        max_tokens: 1000,
      });

      if (response.data.choices[0].message) {
        const answer = response.data.choices[0].message.content;
        const parsedAnswer: NutritionistResponse[] = JSON.parse(answer);

        return parsedAnswer;
      }
    } catch (error) {
      console.log(error);
    }
  }

  private createNutritionistRequestMessages(
    getAdviseDto: GetAdviseDto,
  ): ChatCompletionRequestMessage[] {
    const messages: ChatCompletionRequestMessage[] = [
      {
        role: 'system',
        content: this.nutritionistSystemSetup,
      },
      { role: 'user', content: this.nutritionistUserSetup },
      {
        role: 'assistant',
        content: this.nutritionistAssistantSetup,
      },
      {
        role: 'user',
        content: `diseases:${getAdviseDto.diseases},ingredients: ${getAdviseDto.ingredients}`,
      },
    ];

    return messages;
  }
}
