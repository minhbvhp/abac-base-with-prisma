import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { ResponseTransformInterceptor } from './interceptors/response-transform.interceptor';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);
	app.setGlobalPrefix('api', { exclude: [''] });

	const configService = app.get(ConfigService);
	const port = configService.get('PORT');

	app.useGlobalInterceptors(new ResponseTransformInterceptor());

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
		}),
	);

	await app.listen(port);
}
bootstrap();
