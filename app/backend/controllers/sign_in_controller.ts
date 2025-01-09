import {Controller} from './controller'
import {AccountManager} from '../components/account_manager'
import { Status } from 'utils/status';

export class SignInController extends Controller {
  public handle(): void {
    let body = this.req.body;
    let email = body.email;
    let password = body.password;
    
    //check for bad definitions of body and its expected fields
    if (body == undefined) {
      this.res.status(400).json({ message: "Missing credentials" });
      return;
    }
    if (typeof email !== "string" || typeof password !== "string") {
      this.res.status(400).json({ message: "Bad credentials' format"});
      return;
    }

    //check given credentials
    let result = new AccountManager(email, password).sign_in();
    if (result == Status.error) {
      this.res.status(401).json({ message: "Invalid credentials"});
    } else {
      this.res.status(200);
    }
  }
}
