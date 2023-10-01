export class GlobalConstants {
  public static genericError: string =
    'Something Went Wrong, Please try Again Later';
  public static nameRegex: string = '[a-zA-Z0-9 ]*';
  public static emailRegex: string =
    '[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}';
  public static contactNumberRegex: string = '^[e0-9]{10,10}$';
  public static error: string = 'error';
  public static unauthorized: string = 'You are not authorized';
}
