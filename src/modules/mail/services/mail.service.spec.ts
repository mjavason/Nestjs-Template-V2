import { MailService } from '@/modules/mail/services/mail.service';
import { transporter } from '@configs/mail/mail.config';
import { Test, TestingModule } from '@nestjs/testing';

jest.mock('@configs/mail/mail.config', () => ({
  transporter: {
    sendMail: jest.fn(),
  },
}));

describe('MailService', () => {
  let service: MailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MailService],
    }).compile();

    service = module.get<MailService>(MailService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendSimpleMail', () => {
    it('should send a simple mail', async () => {
      const dto = {
        recipientEmail: 'test@example.com',
        recipientFirstName: 'Test',
        mailHtmlBody: '<p>Hello World</p>',
        mailSubject: 'Test Subject',
      };

      await service.sendSimpleMail(dto);
      expect(transporter.sendMail).toHaveBeenCalled();
    });
  });
});
