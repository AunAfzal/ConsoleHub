import Link from "next/link";
const Item = ({ item }) => {


    return (
        <div className="flex flex-col items-center justify-center p-4 bg-white border rounded-lg shadow-md hover:shadow-lg transition transform hover:scale-105">
            <Link href={`/itemdetail/${item._id}`}>
            <img src={item.productImage} alt={item.name} className="w-24 h-24 object-cover mb-2" />
            <h3 className="text-lg font-bold">{item.name}</h3>
            <p className="text-gray-600">${item.price}</p>
            </Link>
        </div>
    );
};

export default Item;
