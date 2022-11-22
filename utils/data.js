const opts = {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
};

const admin = {
  _id: "6350352d598f7a82b124617b",
  email: "admin@gmail.com",
  password: "$2a$10$etydPmuQhSk6ja2b09DLdujTJlbXMuNcNqQfloxhvAHJA08m7YdsK",
  full_name: "Gerson Rolando Aranibar Concha",
  first_name: "Gerson Rolando",
  last_name: "Aranibar Concha",
  dni: "70800756",
  phone: "940994003",
};

const customer = {
  _id: "6377d1c38d9d5f6a7881eb63",
  email: "pycharm113@gmail.com",
  password: "$2a$10$nXOzcM8yivhv5zOiRYY36eMj3EJEiGXhb8EowgspOw4UaJ0XkSZG6",
  first_name: "JOSE PEDRO",
  last_name: "CASTILLO TERRONES",
  full_name: "Jose Pedro Castillo Terrones",
  dni: "27427864",
  status: true,
  verify: true,
  type: "Prospecto",
  created_by: "6350352d598f7a82b124617b",
  image: {
    public_id: "business/customers/nuqesd755vfhhxxrlvjb",
    secure_url: "https://res.cloudinary.com/dm0fujtre/image/upload/v1668797061/business/customers/nuqesd755vfhhxxrlvjb.webp",
  },
};

const company = {
  _id: "634dff0735ba677c46137b12",
  ruc: "10708007566",
  company: "Template Solutions SAC",
  address: "Jr. Los Incas #312",
  slogan: "Las mejores soluciones a tu alcance.",
  phone: "940994003",
  branding: "#000",
  channels: [{ name: "Whatsapp" }, { name: "Facebook" }, { name: "Instagram" }, { name: "Campaña EM" }, { name: "Publicidad" }, { name: "Tienda" }],
  varieties: [{ name: "Color" }, { name: "Talla" }, { name: "Peso" }, { name: "Marca" }],
};

const categories = [
  {
    _id: "63509ac0548f940f240d0e10",
    title: "Laptops",
    description: "Laptops",
    status: true,
    image: {
      public_id: "business/category/j4fqvu5bsievs3ymwcoz",
      secure_url: "https://res.cloudinary.com/dm0fujtre/image/upload/v1667253623/business/category/j4fqvu5bsievs3ymwcoz.webp",
    },
  },
  {
    _id: "63509b28548f940f240d0e19",
    title: "Licencias",
    description: "Licencias",
    status: true,
    image: {
      public_id: "business/category/rscoijf4p8mqwvo7gw8q",
      secure_url: "https://res.cloudinary.com/dm0fujtre/image/upload/v1667253379/business/category/rscoijf4p8mqwvo7gw8q.webp",
    },
  },
  {
    _id: "63509b19548f940f240d0e16",
    title: "Tecnología",
    description: "Tecnología",
    status: true,
    image: {
      public_id: "business/category/x8nw5qtbtxmz2vom5rap",
      secure_url: "https://res.cloudinary.com/dm0fujtre/image/upload/v1667253496/business/category/x8nw5qtbtxmz2vom5rap.webp",
    },
  },
  {
    _id: "63509acf548f940f240d0e13",
    title: "Periféricos",
    description: "Periféricos",
    status: true,
    image: {
      public_id: "business/category/gf8xqsl8portld6onjxs",
      secure_url: "https://res.cloudinary.com/dm0fujtre/image/upload/v1667253232/business/category/gf8xqsl8portld6onjxs.webp",
    },
  },
];

const products = [
  {
    _id: "636054b302f7295ffde3b422",
    title: "Teclado Logitech MK120",
    description: "Teclado Logitech",
    type: "Físico",
    slug: "teclado-logitech-mk120",
    variety: "Color",
    stock: 0,
    price: 0,
    image: {
      public_id: "business/products/vly1d1edzrly83euebvu",
      secure_url: "https://res.cloudinary.com/dm0fujtre/image/upload/v1667257522/business/products/vly1d1edzrly83euebvu.webp",
    },
    status: true,
    category: "63509acf548f940f240d0e13",
    created_by: "6350352d598f7a82b124617b",
  },
  {
    _id: "636011a176a88fd4c43b199b",
    title: "Asus Intel Core i7 1165H",
    description: "Asus Intel Core i7 1165H",
    type: "Físico",
    slug: "asus-intel-core-i7-1165h",
    variety: "Color",
    stock: 0,
    price: 0,
    image: {
      public_id: "business/products/reki5egi1owf8tavbmuc",
      secure_url: "https://res.cloudinary.com/dm0fujtre/image/upload/v1667257594/business/products/reki5egi1owf8tavbmuc.webp",
    },
    status: true,
    category: "63509ac0548f940f240d0e10",
    created_by: "6350352d598f7a82b124617b",
  },
  {
    _id: "636054cd02f7295ffde3b42c",
    title: "Mouse Ryzen Deathadder V2",
    description: "Mouse Ryzen",
    type: "Físico",
    slug: "mouse-ryzen-deathadder-v2",
    variety: "Color",
    stock: 0,
    price: 0,
    image: {
      public_id: "business/products/oxrh6umdol4iwknrdxkl",
      secure_url: "https://res.cloudinary.com/dm0fujtre/image/upload/v1667257547/business/products/oxrh6umdol4iwknrdxkl.webp",
    },
    status: true,
    category: "63509acf548f940f240d0e13",
    created_by: "6350352d598f7a82b124617b",
  },
  {
    _id: "636054ec02f7295ffde3b435",
    title: "Windows 10 Oficial",
    description: "Windows",
    type: "Digital",
    slug: "windows-10-oficial-",
    variety: "Tipo",
    stock: 0,
    price: 0,
    image: {
      public_id: "business/products/xlrddyd91bzunmjd2tr8",
      secure_url: "https://res.cloudinary.com/dm0fujtre/image/upload/v1667257579/business/products/xlrddyd91bzunmjd2tr8.webp",
    },
    status: true,
    category: "63509b28548f940f240d0e19",
    created_by: "6350352d598f7a82b124617b",
  },
  {
    _id: "6377c9d630ad6c97f5d0f6c1",
    title: "Silla Gamer Racing",
    description: "Silla Gamer Racing",
    type: "Físico",
    slug: "silla-gamer-racing",
    variety: "Color",
    stock: 0,
    price: 0,
    image: {
      public_id: "business/products/jbrwehcbep1hs6y3pgie",
      secure_url: "https://res.cloudinary.com/dm0fujtre/image/upload/v1668794839/business/products/jbrwehcbep1hs6y3pgie.webp",
    },
    status: true,
    category: "63509b19548f940f240d0e16",
    created_by: "6350352d598f7a82b124617b",
  },
];

const courses = [
  {
    _id: "6377a1888cfdf3829a7f4ae2",
    title: "Desarrollo Web",
    description: "Curso de Desarrollo Web con Angular",
    slug: "desarrollo-web",
    image: {
      public_id: "business/courses/sl9ggg1p3fry0lgxmxwf",
      secure_url: "https://res.cloudinary.com/dm0fujtre/image/upload/v1668784522/business/courses/sl9ggg1p3fry0lgxmxwf.webp",
    },
    status: true,
  },
  {
    _id: "6377a40b8cfdf3829a7f4b09",
    title: "Estadística Descriptiva",
    description: "Curso de Estadística Descriptiva",
    slug: "estadstica-descriptiva",
    image: {
      public_id: "business/courses/qw9gazgc3jcmvi9tygxv",
      secure_url: "https://res.cloudinary.com/dm0fujtre/image/upload/v1668785164/business/courses/qw9gazgc3jcmvi9tygxv.webp",
    },
    status: true,
  },
  {
    _id: "6377a1b38cfdf3829a7f4ae6",
    title: "Ofimática Empresarial",
    description: "Curso de Ofimática Empresarial",
    slug: "ofimtica-empresarial",
    image: {
      public_id: "business/courses/g3mxsq0jzzz57d3lnqse",
      secure_url: "https://res.cloudinary.com/dm0fujtre/image/upload/v1668784564/business/courses/g3mxsq0jzzz57d3lnqse.webp",
    },
    status: true,
  },
  {
    _id: "6377a3698cfdf3829a7f4afd",
    title: "Programación con Python",
    description: "Curso de Programación con Python",
    slug: "programacin-con-python",
    image: {
      public_id: "business/courses/k7ii4uxgi7mnhqejeaqo",
      secure_url: "https://res.cloudinary.com/dm0fujtre/image/upload/v1668785316/business/courses/k7ii4uxgi7mnhqejeaqo.webp",
    },
    status: true,
  },

  {
    _id: "6377a544310bc7330aad285f",
    title: "React para Principiantes",
    description: "Desarrollo Web con React",
    slug: "react-para-principiantes",
    image: {
      public_id: "business/courses/au47ruo17p7gbcc1yzx1",
      secure_url: "https://res.cloudinary.com/dm0fujtre/image/upload/v1668785517/business/courses/au47ruo17p7gbcc1yzx1.webp",
    },
    status: true,
  },
];

const arr_months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

module.exports = Object.freeze({
  opts,
  admin,
  customer,
  company,
  categories,
  products,
  courses,
  arr_months,
});
