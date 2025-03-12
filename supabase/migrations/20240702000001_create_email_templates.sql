-- Create email templates for the system
CREATE TABLE IF NOT EXISTS email_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default email templates
INSERT INTO email_templates (name, subject, body) VALUES
('invitation', 'Zaproszenie do ApartGuide', '<h1>Witaj {{first_name}}!</h1><p>Zostałeś zaproszony do dołączenia do systemu ApartGuide jako członek zespołu.</p><p>Aby aktywować swoje konto, kliknij poniższy link:</p><p><a href="{{invitation_link}}">Aktywuj konto</a></p><p>Link wygaśnie za 7 dni.</p><p>Pozdrawiamy,<br>Zespół ApartGuide</p>'),
('password_reset', 'Reset hasła w ApartGuide', '<h1>Witaj!</h1><p>Otrzymaliśmy prośbę o reset hasła do Twojego konta w systemie ApartGuide.</p><p>Aby zresetować hasło, kliknij poniższy link:</p><p><a href="{{reset_link}}">Resetuj hasło</a></p><p>Link wygaśnie za 24 godziny.</p><p>Jeśli nie prosiłeś o reset hasła, zignoruj tę wiadomość.</p><p>Pozdrawiamy,<br>Zespół ApartGuide</p>'),
('welcome', 'Witaj w ApartGuide', '<h1>Witaj {{first_name}}!</h1><p>Dziękujemy za dołączenie do systemu ApartGuide.</p><p>Twoje konto zostało pomyślnie utworzone. Możesz teraz zalogować się używając swojego adresu email i hasła.</p><p><a href="{{login_link}}">Zaloguj się</a></p><p>Pozdrawiamy,<br>Zespół ApartGuide</p>')
ON CONFLICT (name) DO NOTHING;

-- Enable realtime for email_templates
ALTER PUBLICATION supabase_realtime ADD TABLE email_templates;
