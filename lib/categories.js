// Product categories, in display order. `title` and `description` are the
// search-result title and meta description for each category page; `image`
// is the photo used for the category tile on the homepage.
export const categoryList = [
  {
    id: "containers",
    name: "Food Containers",
    title: "Airtight Food Storage Containers",
    description:
      "Airtight food storage containers from Visto Homeware, including the Feel Fresh, Snap Fresh, Elite, Tic Tac and Flip ranges. Ask for retail or wholesale prices.",
    image: "/new-products/D-7.jpeg",
  },
  {
    id: "container-sets",
    name: "Container Sets",
    title: "Food Container Sets and Jar Sets",
    description:
      "Container sets and festival jar sets from Visto Homeware: Neo Lock, Lock Tight, Bingo, Snap Fresh and more, with gift boxes. Ask for retail or wholesale prices.",
    image: "/new-products/G-14.jpg",
  },
  {
    id: "water-bottles",
    name: "Water Bottles",
    title: "Water Bottles, Insulated Bottles and Jugs",
    description:
      "Insulated water bottles, sipper bottles and water jugs from Visto Homeware, including Ozon, Stark, Legend and Pacific. Ask for retail or wholesale prices.",
    image: "/new-products/WA-1.jpeg",
  },
  {
    id: "lunch-boxes",
    name: "Lunch Boxes & Tiffins",
    title: "Lunch Boxes and Tiffin Boxes",
    description:
      "Lunch boxes and tiffin boxes for school and work from Visto Homeware, with steel, insulated and multi-compartment options. Ask for retail or wholesale prices.",
    image: "/new-products/T-5.png",
  },
  {
    id: "drinkware",
    name: "Drinkware",
    title: "Mugs, Coffee Cups and Sippers",
    description:
      "Coffee mugs, tea cups, sippers and flasks from Visto Homeware for home and office. Ask for retail or wholesale prices.",
    image: "/additional-products/CH-6.jpeg",
  },
  {
    id: "casseroles",
    name: "Casseroles",
    title: "Casseroles and Serveware",
    description:
      "Insulated casseroles and serving bowls from Visto Homeware, including Signate, Ambrosia, Exon Platina and Wave. Ask for retail or wholesale prices.",
    image: "/new-products/CS-2.jpeg",
  },
  {
    id: "household",
    name: "Household",
    title: "Folding Stools, Organisers and Household Products",
    description:
      "Folding stools, baby chairs, spice boxes, organisers and other household products from Visto Homeware. Ask for retail or wholesale prices.",
    image: "/new-products/ST-1.png",
  },
];

export const getCategory = (id) => categoryList.find((c) => c.id === id);
