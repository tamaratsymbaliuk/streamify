import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { PrismaService } from '../../core/prisma/prisma.service';

@Injectable()
export class GqlAuthGuard implements CanActivate {
	constructor(private readonly prismaService: PrismaService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const ctx = GqlExecutionContext.create(context)
		const request = ctx.getContext().req

		// ❗️Check if session userId exists
		if (typeof request.session.userId === 'undefined') {
			throw new UnauthorizedException('user is not authorized')
		}

		// ❗️Ensure user exists in DB
		const user = await this.prismaService.user.findUnique({
			where: {
				id: request.session.userId,
			},
		})

		// Optionally: Handle deleted users or edge cases
		if (!user) {
			throw new UnauthorizedException('user is not found')
		}

		// 🔐 Attach user to request
		request.user = user

		return true
	}
}
