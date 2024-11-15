

// const client = createClient({
//   space: process.env.CONTENTFUL_SPACE_ID,
//   accessToken: process.env.CONTENTFUL_ACCESS_KEY,
// });

// async function fetchMountain(slug) {
//   try {
//     const { items } = await client.getEntries({
//       content_type: 'mountain',
//       'fields.slug': slug,
//     });
    
//     return items[0];
//   } catch (error) {
//     console.error('Error fetching mountain:', error);
//     return null;
//   }
// }

// export async function generateStaticParams() {
//   try {
//     const res = await client.getEntries({ content_type: 'mountain' });

//     return res.items.map((item) => ({
//       params: { slug: item.fields.slug },
//     }));
//   } catch (error) {
//     console.error('Error generating static params:', error);
//     return [];
//   }
// }

// const Mountain = async ({ params }) => {
//   const { slug } = params;
//   const mountain = await fetchMountain(slug);

//   if (!mountain) {
//     return <div>Mountain not found</div>;
//   }

//   const { title, mountainSpecs, description, thumbnail, carNavLink } = mountain.fields;

//   // destructure mountainSpecs array

//   const [height, distance, ascendTime, elevation, difficulty] = mountainSpecs;

  const Insect = () => {
  return (
    <div className=''>
      <div className="relative md:bg-fixed bg-center bg-cover h-96 md:h-[600px] bg-[url('/mountain1.webp')] before:absolute before:inset-0 before:bg-black before:opacity-40 mb-6 md:mb-12 ">
        <h1 className="absolute top-3/4 md:top-1/2 bg-black/80 text-off-white text-3xl text-bold px-3 py-5">SAMPLE INSECT</h1>
      </div> 
      <div className="container w-full mx-auto flex flex-col lg:grid lg:grid-cols-2 gap-6 lg:grid-rows-3 p-3 lg:p-0">
       
        <div className=" grid-emelent-2 bg-off-white  ">
          <p className="">
          {/* {documentToReactComponents(description)} */}
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
                Section 1.10.32 of "de Finibus Bonorum et Malorum", written by Cicero in 45 BC "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?"
          </p>
        </div>
        <div className="grid-element-3 bg-earth-gray p-48 mx-auto w-full col-start-2 ">
          IMAGE BOX
        </div>
      </div>
    </div>  

  );
};

export default Insect;

