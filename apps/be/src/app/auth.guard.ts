import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { getUserDataFromSessionId } from "@syncit/core/utils";

const unProtectedRoutes = ['/api/auth/login','/api/auth/register']

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(
    context: ExecutionContext,
  ):  Promise<boolean>  {
    const request = context.switchToHttp().getRequest();
    if(unProtectedRoutes.includes(request.route.path)) {
      return true
    }
    const userData = await getUserDataFromSessionId(request.cookies.sessionID);
    return userData?.id;
  }
}
