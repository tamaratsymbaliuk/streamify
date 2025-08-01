import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import type { User } from '../../../prisma/generated'

export const Authorized = createParamDecorator(
	(data: keyof User, ctx: ExecutionContext) => {
		let user: User

		// Extract user from req depending on transport
		if (ctx.getType() === 'http') {
			user = ctx.switchToHttp().getRequest().user
		} else {
			const context = GqlExecutionContext.create(ctx)
			user = context.getContext().req.user
		}

		// Return field if provided, otherwise whole user
		return data ? user[data] : user
	}
)
