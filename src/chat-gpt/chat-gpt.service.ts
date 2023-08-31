import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from 'openai';
import { GetAdviseDto } from './dto/get-advise.dto';
import { ChemistResponse, NutritionistResponse } from './interface/interface';
import { ExtractIngredientsDto } from './dto/extract-ingredients-dto';
import { ExtractTarget } from './enum/enum';

@Injectable()
export class ChatGptService {
  private openAiOne: OpenAIApi;
  private openAiTwo: OpenAIApi;
  private openAiThree: OpenAIApi;
  private openAiFour: OpenAIApi;

  private openAiModel: string;
  private nutritionistSystemSetup: string;
  private nutritionistUserSetup: string;
  private assistantSetup: string;
  private extractorNutritionistSetup: string;
  private chemistSystemSetup: string;
  private extractorChemistSetup: string;
  private chemistUserSetup: string;

  constructor(private readonly configService: ConfigService) {
    const openAiOneConfig = new Configuration({
      apiKey: configService.get<string>('OPENAI_SECRET_KEY_KIM'),
    });
    const openAiTwoConfig = new Configuration({
      apiKey: configService.get<string>('OPENAI_SECRET_KEY_LEE'),
    });
    const openAiThreeConfig = new Configuration({
      apiKey: configService.get<string>('OPENAI_SECRET_KEY_SUA'),
    });
    const openAiFourConfig = new Configuration({
      apiKey: configService.get<string>('OPENAI_SECRET_KEY_EUN'),
    });

    this.openAiOne = new OpenAIApi(openAiOneConfig);
    this.openAiTwo = new OpenAIApi(openAiTwoConfig);
    this.openAiThree = new OpenAIApi(openAiThreeConfig);
    this.openAiFour = new OpenAIApi(openAiFourConfig);

    this.openAiModel = configService.get<string>('OPENAI_MODEL');
    this.nutritionistSystemSetup = configService.get<string>(
      'NUTRITIONIST_SYSTEM_SETUP',
    );
    this.nutritionistUserSetup = configService.get<string>(
      'NUTRITIONIST_USER_SETUP',
    );
    this.assistantSetup = configService.get<string>('ASSISTANT_SETUP');
    this.extractorNutritionistSetup = configService.get<string>(
      'EXTRACTOR_NUTRITIONIST_SETUP',
    );
    this.chemistSystemSetup = configService.get<string>('CHEMIST_SYSTEM_SETUP');
    this.extractorChemistSetup = configService.get<string>(
      'EXTRACTOR_CHEMIST_SETUP',
    );
    this.chemistUserSetup = configService.get<string>('CHEMIST_USER_SETUP');
  }

  async getAdviseFromNutritionist(
    getAdviseDto: GetAdviseDto,
  ): Promise<NutritionistResponse[]> {
    const messages: ChatCompletionRequestMessage[][] =
      this.createNutritionistRequestMessages(getAdviseDto);

    const answer: NutritionistResponse[] =
      await this.fetchChatGptAdvise(messages);

    return answer;
  }

  private splitIngredients(ingredients: string[]): string[][] {
    if (ingredients.length <= 3) {
      return [ingredients];
    }

    let numberOfArrays = 2;

    if (ingredients.length >= 12) {
      //요소가 12개 이상일때부터 모델 4개 사용
      numberOfArrays = 4;
    } else if (ingredients.length >= 9) {
      numberOfArrays = 3;
    }
    const totalIngredients = ingredients.length;
    const ingredientsPerArray = Math.ceil(totalIngredients / numberOfArrays);

    const splitArrays: string[][] = [];
    for (let i = 0; i < numberOfArrays; i++) {
      const startIndex = i * ingredientsPerArray;
      const endIndex = startIndex + ingredientsPerArray;
      const newArray = ingredients.slice(startIndex, endIndex);
      splitArrays.push(newArray);
    }

    return splitArrays;
  }

  private createNutritionistRequestMessages(
    getAdviseDto: GetAdviseDto,
  ): ChatCompletionRequestMessage[][] {
    const ingredients = getAdviseDto.ingredients.flat();

    const baseMessages: ChatCompletionRequestMessage[] = [
      {
        role: 'system',
        content: this.nutritionistSystemSetup,
      },
      { role: 'user', content: this.nutritionistUserSetup },
      {
        role: 'assistant',
        content: this.assistantSetup,
      },
    ];
    const splitMessages: ChatCompletionRequestMessage[][] =
      this.createSplitMessages(getAdviseDto, ingredients, baseMessages);
    return splitMessages;
  }

  private createSplitMessages(
    getAdviseDto: GetAdviseDto,
    ingredients: string[],
    baseMessages: ChatCompletionRequestMessage[],
  ) {
    const splitIngredientArrays = this.splitIngredients(ingredients);

    const splitMessages: ChatCompletionRequestMessage[][] = [];

    for (const splitIngredientArray of splitIngredientArrays) {
      if (splitIngredientArray.length) {
        const messages: ChatCompletionRequestMessage[] = [
          ...baseMessages,
          {
            role: 'user',
            content: `diseases:${getAdviseDto.diseases}, ingredients:${splitIngredientArray}`,
          },
        ];
        splitMessages.push(messages);
      }
    }

    return splitMessages;
  }

  async extractIngredients(extractIngredientsDto: ExtractIngredientsDto) {
    const messages: ChatCompletionRequestMessage[] =
      this.createExtractRequestMessage(extractIngredientsDto);

    const extractedIngredients: string[] =
      await this.fetchChatGptExtractedIngredients(messages);

    return extractedIngredients;
  }

  private createExtractRequestMessage(
    extractIngredientsDto: ExtractIngredientsDto,
  ): ChatCompletionRequestMessage[] {
    if (extractIngredientsDto.extractTarget === ExtractTarget.NUTRITIONIST) {
      const messages: ChatCompletionRequestMessage[] = [
        {
          role: 'system',
          content: this.nutritionistSystemSetup,
        },
        { role: 'user', content: this.extractorNutritionistSetup },
        {
          role: 'assistant',
          content: this.assistantSetup,
        },
        {
          role: 'user',
          content: `description: ${extractIngredientsDto.description}`,
        },
      ];

      return messages;
    } else if (extractIngredientsDto.extractTarget === ExtractTarget.CHEMIST) {
      const messages: ChatCompletionRequestMessage[] = [
        {
          role: 'system',
          content: this.chemistSystemSetup,
        },
        { role: 'user', content: this.extractorChemistSetup },
        {
          role: 'assistant',
          content: this.assistantSetup,
        },
        {
          role: 'user',
          content: `description: ${extractIngredientsDto.description}`,
        },
      ];

      return messages;
    }
  }

  private async fetchChatGptExtractedIngredients(messages) {
    try {
      const response = await this.openAiOne.createChatCompletion({
        model: this.openAiModel,
        messages: messages,
        temperature: 0,
        max_tokens: 2000,
      });
      try {
        console.log(response.data.choices[0].message.content);

        const parsedAnswer = JSON.parse(
          response.data.choices[0].message.content,
        );
        console.log(parsedAnswer);

        return parsedAnswer;
      } catch (error) {
        console.log(error);

        return null;
      }
    } catch (error) {
      throw error;
    }
  }

  private async createModelResponse(openAiInstance, messages) {
    const response = await openAiInstance.createChatCompletion({
      model: this.openAiModel,
      messages,
      temperature: 0,
      max_tokens: 2000,
    });

    return JSON.parse(response.data.choices[0].message.content);
  }

  private async fetchChatGptAdvise(messages) {
    try {
      let openAiInstances: OpenAIApi[] = [this.openAiOne];

      if (messages.length === 2) {
        console.log(2);

        openAiInstances = [this.openAiOne, this.openAiTwo];
      }
      if (messages.length === 3) {
        console.log(3);

        openAiInstances = [this.openAiOne, this.openAiTwo, this.openAiThree];
      }

      if (messages.length === 4) {
        console.log(4);

        openAiInstances = [
          this.openAiOne,
          this.openAiTwo,
          this.openAiThree,
          this.openAiFour,
        ];
      }

      const modelResponses = await Promise.all(
        messages.map((msg, index) =>
          this.createModelResponse(openAiInstances[index], msg),
        ),
      );

      return modelResponses.flat();
    } catch (error) {
      console.log(error.response);
    }
  }

  async getAdviseFromChemist(
    getAdviseDto: GetAdviseDto,
  ): Promise<ChemistResponse[]> {
    const messages: ChatCompletionRequestMessage[][] =
      this.createChemistRequestMessages(getAdviseDto);

    const answer: ChemistResponse[] = await this.fetchChatGptAdvise(messages);

    return answer;
  }

  private createChemistRequestMessages(
    getAdviseDto: GetAdviseDto,
  ): ChatCompletionRequestMessage[][] {
    const ingredients = getAdviseDto.ingredients.flat();

    const baseMessages: ChatCompletionRequestMessage[] = [
      {
        role: 'system',
        content: this.chemistSystemSetup,
      },
      { role: 'user', content: this.chemistUserSetup },
      {
        role: 'assistant',
        content: this.assistantSetup,
      },
    ];

    const splitMessages: ChatCompletionRequestMessage[][] =
      this.createSplitMessages(getAdviseDto, ingredients, baseMessages);
    return splitMessages;
  }
}
