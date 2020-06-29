import { Application } from '../declarations';
import libraryBookOperationService from './library_book_operation_service/library_book_operation_service.service';
// Don't remove this comment. It's needed to format import lines nicely.

export default function (app: Application) {
  app.configure(libraryBookOperationService);
}
