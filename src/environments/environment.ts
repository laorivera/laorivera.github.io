export class Environments {

constructor(){}

public environment = {
  production: true,
  apiBaseUrl: 'https://crm-resulting-toolbar-clay.trycloudflare.com',
} 

public decode(): string {
  const encoded = '!DA$N3NN@S';
  return encoded.split('').reverse().join('');
}
}
