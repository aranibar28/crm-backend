const objVendedor = {
  title: "Ecommerce",
  icon: "uil-store",
  menu: [
    {
      title: "Categorias",
      path: "/categories",
    },
    {
      title: "Productos",
      path: "/products",
    },
    {
      title: "Inventario",
      path: "/inventories",
    },
    {
      title: "Ventas",
      path: "/sales",
    },
  ],
};

const objInstructor = {
  title: "Matrículas",
  icon: "uil-books",
  menu: [
    {
      title: "Cursos",
      path: "/courses",
    },
    {
      title: "Inscripciones",
      path: "/inscriptions",
    },
  ],
};

const getMenu = (role = "") => {
  const sidebar = [
    {
      title: "Dashboard",
      icon: "uil-home-alt",
      menu: [
        {
          title: "Mi cuenta",
          path: "/profile",
        },
      ],
    },
    {
      title: "Usuarios",
      icon: "uil-user",
      menu: [
        {
          title: "Clientes",
          path: "/customers",
        },
      ],
    },
  ];

  if (role === "Administrador") {
    sidebar[0].menu.push(
      {
        title: "Configuración",
        path: "/config",
      },
      {
        title: "Rendimiento",
        path: "/performance",
      }
    );

    sidebar[1].menu.unshift({
      title: "Empleados",
      path: "/employees",
    });

    sidebar.push(objVendedor);
    sidebar.push(objInstructor);
  }

  if (role === "Vendedor") {
    sidebar.push(objVendedor);
  }

  if (role === "Instructor") {
    sidebar.push(objInstructor);
  }

  return sidebar;
};

module.exports = Object.freeze({
  getMenu,
});
