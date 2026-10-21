export const MAIL_QUEUE = 'mail';

export interface VerificationCodeJob {
  to: string;
  code: string;
}
