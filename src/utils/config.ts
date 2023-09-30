import envSchema from 'env-schema';
import { Type, Static } from '@sinclair/typebox';

const schema = Type.Object({
  PORT: Type.Number({
    default: 3100,
  }),
  JWT_SECRET: Type.String(),
  MONGO_URI: Type.String(),
});

type Env = Static<typeof schema>;

export const config = envSchema<Env>({
  schema,
  dotenv: true,
});
