const BlogForm = ({
    handleBlogForm,
    newBlog,
    setNewBlog
}) => (
    <div>
        <h2>create new</h2>
        <form onSubmit={handleBlogForm}>
            <div>
                title:
                <input
                    type="text"
                    value={newBlog.title}
                    name="Title"
                    onChange={({ target }) => setNewBlog({
                        ...newBlog,
                        title: target.value
                    })}
                />
            </div>
            <div>
                author:
                <input
                    type="text"
                    value={newBlog.author}
                    name="Author"
                    onChange={({ target }) => setNewBlog({
                        ...newBlog,
                        author: target.value
                    })}
                />
            </div>
            <div>
                url:
                <input
                    type="text"
                    value={newBlog.url}
                    name="Url"
                    onChange={({ target }) => setNewBlog({
                        ...newBlog,
                        url: target.value
                    })}
                />
            </div>
            <button type="submit">create</button>
        </form>
    </div>
)

export default BlogForm