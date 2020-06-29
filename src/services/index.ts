import { Application } from '../declarations';
import rentBookService from './rent-book-service/rent-book-service.service';
// Don't remove this comment. It's needed to format import lines nicely.

export default function (app: Application) {
  app.configure(rentBookService);
}
