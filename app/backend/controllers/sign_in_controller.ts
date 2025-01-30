import {Controller} from './controller'
import {AccountManager} from '../components/account_manager'
import { Status } from '../utils/status';

export class SignInController extends Controller {
  public async handle(): Promise<void> {
    let body = this.req.body;

    //check for bad definitions of body and its expected fields
    if (body == undefined) {
      this.res.status(400).json({ message: "Missing credentials" });
      return;
    }
    if (typeof body.email !== "string" || typeof body.password !== "string") {
      this.res.status(400).json({ message: "Bad credentials' format"});
      return;
    }

    //check given credentials
    let email = body.email;
    let password = body.password;
    let [status, type] = await new AccountManager().sign_in(email, password);
    if (status === Status.error) {
      this.res.status(401).json({ message: "Invalid credentials"});
    } else {
      this.res.status(200).json({ user_type: type});
    }
  }
}
