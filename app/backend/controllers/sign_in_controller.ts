import {Controller} from './controller'
import {AccountManager} from '../components/account_manager'

export class SignInController extends Controller {
  public handle(): void {
      let body = this.req.body;
      
      if (body == undefined) {
        // returns error: missing body
      }
  }
}
