import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar el formulario
    console.log('Formulario enviado:', formData);
    alert('¡Mensaje enviado! Nos pondremos en contacto contigo pronto.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Contacto</h1>
        <p className="text-muted-foreground">
          ¿Tienes alguna pregunta o necesitas ayuda? Estamos aquí para asistirte.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Información de Contacto */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Información de Contacto</CardTitle>
              <CardDescription>
                Puedes contactarnos a través de los siguientes medios
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-red-50 p-2 rounded-full">
                  <Mail className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">soporte@rosteredge.com</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-orange-50 p-2 rounded-full">
                  <Phone className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <p className="font-medium">Teléfono</p>
                  <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-rose-50 p-2 rounded-full">
                  <MapPin className="h-5 w-5 text-rose-500" />
                </div>
                <div>
                  <p className="font-medium">Dirección</p>
                  <p className="text-sm text-muted-foreground">Av. Principal 123, Ciudad</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-pink-50 p-2 rounded-full">
                  <Clock className="h-5 w-5 text-pink-500" />
                </div>
                <div>
                  <p className="font-medium">Horario de Atención</p>
                  <p className="text-sm text-muted-foreground">Lun - Vie: 9:00 - 18:00</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Soporte Técnico</CardTitle>
              <CardDescription>Atención especializada para problemas técnicos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Para reportar problemas técnicos o solicitar asistencia con la plataforma, nuestro
                  equipo de soporte está disponible durante el horario comercial.
                </p>
                <Button
                  variant="outline"
                  className="w-full border-red-200 hover:bg-red-50"
                  onClick={() => (window.location.href = '/support')}
                >
                  Ir a Soporte Técnico
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Formulario de Contacto */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Envíanos un Mensaje</CardTitle>
              <CardDescription>
                Completa el formulario y nos pondremos en contacto contigo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Nombre Completo *
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Tu nombre completo"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="tu@email.com"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">
                    Asunto *
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="¿En qué podemos ayudarte?"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Mensaje *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Describe tu consulta o problema..."
                    rows={6}
                    required
                  />
                </div>

                <Button type="submit" className="bg-red-500 hover:bg-red-600">
                  <Send className="h-4 w-4 mr-2" />
                  Enviar Mensaje
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Contact;
