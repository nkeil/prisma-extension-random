import { prisma } from './db';

const users = [
  { firstName: 'Ida', lastName: 'Lupino' },
  { firstName: 'Bong', lastName: 'Joon Ho' },
  { firstName: 'Guillermo', lastName: 'del Toro' },
  { firstName: 'David', lastName: 'Cronenberg' },
  { firstName: 'Sidney', lastName: 'Lumet' },
  { firstName: 'Woody', lastName: 'Allen' },
  { firstName: 'Kathryn', lastName: 'Bigelow' },
  { firstName: 'Tim', lastName: 'Burton' },
  { firstName: 'Terry', lastName: 'Gilliam' },
  { firstName: 'Wes', lastName: 'Anderson' },
  { firstName: 'Lois', lastName: 'Weber' },
  { firstName: 'William', lastName: 'Friedkin' },
  { firstName: 'Darren', lastName: 'Aronofsky' },
  { firstName: 'Spike', lastName: 'Lee' },
  { firstName: 'Pedro', lastName: 'Almodóvar' },
  { firstName: 'Lars', lastName: 'von Trier' },
  { firstName: 'Abbas', lastName: 'Kiarostami' },
  { firstName: 'Brian', lastName: 'De Palma' },
  { firstName: 'Alejandro', lastName: 'González Iñárritu' },
  { firstName: 'Satyajit', lastName: 'Ray' },
  { firstName: 'Ridley', lastName: 'Scott' },
  { firstName: 'Alice', lastName: 'Guy-Blaché' },
  { firstName: 'Frank', lastName: 'Capra' },
  { firstName: 'D.W.', lastName: 'Griffith' },
  { firstName: 'Terrence', lastName: 'Malick' },
  { firstName: 'Fritz', lastName: 'Lang' },
  { firstName: 'Andrei', lastName: 'Tarkovsky' },
  { firstName: 'David', lastName: 'Lean' },
  { firstName: 'Alfonso', lastName: 'Cuarón' },
  { firstName: 'John', lastName: 'Cassavetes' },
  { firstName: 'Roman', lastName: 'Polanski' },
  { firstName: 'Billy', lastName: 'Wilder' },
  { firstName: 'Christopher', lastName: 'Nolan' },
  { firstName: 'F.W.', lastName: 'Murnau' },
  { firstName: 'David', lastName: 'Fincher' },
  { firstName: 'Jea', lastName: '-Luc Godard' },
  { firstName: 'David', lastName: 'Lynch' },
  { firstName: 'Yasujiro', lastName: 'Ozu' },
  { firstName: 'Orson', lastName: 'Welles' },
  { firstName: 'Francis', lastName: 'Ford Coppola' },
  { firstName: 'Federico', lastName: 'Fellini' },
  { firstName: 'Paul', lastName: 'Thomas Anderson' },
  { firstName: 'Denis', lastName: 'Villeneuve' },
  { firstName: 'Charlie', lastName: 'Chaplin' },
  { firstName: 'Sergei', lastName: 'Eisenstein' },
  { firstName: 'John', lastName: 'Ford' },
  { firstName: 'Ingmar', lastName: 'Bergman' },
  { firstName: 'Quentin', lastName: 'Tarantino' },
  { firstName: 'Martin', lastName: 'Scorsese' },
  { firstName: 'Steven', lastName: 'Spielberg' },
  { firstName: 'Akira', lastName: 'Kurosawa' },
  { firstName: 'Alfred', lastName: 'Hitchcock' },
  { firstName: 'Stanley', lastName: 'Kubrick' },
];

const posts = [
  {
    title: 'My first blog',
    content: 'This is my first ever blog post about prisma',
    published: true,
  },
  {
    title: 'My second blog',
    content: 'This is my second blog post',
    published: false,
  },
  {
    title: 'I love prisma',
    content: 'This is my third blog post',
    published: true,
  },
];

const main = async () => {
  for (const userData of users) {
    const user = await prisma.user.create({
      select: { id: true },
      data: userData,
    });
    for (const postData of posts) {
      await prisma.post.create({
        data: {
          author: { connect: { id: user.id } },
          ...postData,
        },
      });
    }
  }
};

main();
