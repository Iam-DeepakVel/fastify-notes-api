import { FastifyRequest, FastifyReply } from 'fastify';
import { createUser, findUserByEmail } from './user.service';
import { LoginUserDto } from './dtos/user.dtos';
import { compareSync } from 'bcrypt';
import fastify from 'fastify';

export async function registerHandler(
  request: FastifyRequest<{
    Body: Parameters<typeof createUser>[number];
  }>,
  reply: FastifyReply
) {
  try {
    const data = request.body;
    const { _id, name, email } = await createUser(data);

    const payload = {
      _id,
      name,
      email,
    };

    reply.code(201).send({
      message: 'Registeration Successful',
      accessToken: request.jwt.sign(payload),
    });
  } catch (error) {
    fastify().log.error(error, 'Error Registering User');
    return reply.code(500).send(error);
  }
}

export async function loginHandler(
  request: FastifyRequest<{
    Body: LoginUserDto;
  }>,
  reply: FastifyReply
) {
  try {
    const { email, password } = request.body;

    const user = await findUserByEmail(email);

    if (!user) {
      return reply.status(401).send({
        message: 'Invalid Credentials',
      });
    }

    if (!compareSync(password, user.password)) {
      return reply.status(401).send({
        message: 'Invalid Credentials',
      });
    }

    const { _id, name } = user;

    const payload = {
      _id,
      email,
      name,
    };

    return { accessToken: request.jwt.sign(payload) };
  } catch (error) {
    fastify().log.error(error, 'Error Login');
    return reply.code(500).send(error);
  }
}
