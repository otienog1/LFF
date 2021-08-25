const Categories = ({ categories }) => (
    <span className="ml-1">
        under
        {categories.length > 0 ? (
            categories.map((category, index) => (
                <span key={index} className="ml-1">
                    {` ${category.name}`}
                </span>
            ))
        ) : ""//(
            // <span className="ml-1"> {categories.edges.node.name}</span>
            //)
        }
    </span>
)

export default Categories