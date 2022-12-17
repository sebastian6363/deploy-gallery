import { useEffect } from "react";
import { useState } from "react";
import Card from "../components/Card";

const Photos = () => {
  const [photos, setPhotos] = useState([]);
  const [sort, setSort] = useState("asc");
  const [submited, setSubmited] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deletePhoto = (id) => {
    // TODO: answer here
    const url = "https://gallery-app-server.vercel.app/photos/" + id
    fetch (url, {method: "DELETE"})
    .then(res => res.json())
    .then(() =>{
      setPhotos(result => {
        return result.filter(x => x.id !== id)
      })
    })
  };

  const submit = async () => {
    try {
      const url = "https://gallery-app-server.vercel.app/photos?q=" + submited;
      const res = await fetch(url);
      const result = await res.json();
      setPhotos(result);
      setLoading(false);
    } catch (error) {
      setError(error);
    }
  };

  useEffect(() => {
    setLoading(true);
    if (sort === "asc") {
      fetch("https://gallery-app-server.vercel.app/photos")
        .then((res) => res.json())
        .then((res) => {
          setPhotos(res);
          setLoading(false);
        })
        .catch((error) => setError(error));
      submited ? submit() : setError(error);
    } else {
      fetch("https://gallery-app-server.vercel.app/photos/?_sort=id&_order=desc")
        .then((res) => res.json())
        .then((res) => {
          setPhotos(res);
          setLoading(false);
        })
        .catch((error) => {
          setError(error);
        });
    };
    submit ()
  }, [error, sort, submit, submited]);

  if (error) return <h1 style={{ width: "100%", textAlign: "center", marginTop: "20px" }} >Error!</h1>;

  return (
    <>
      <div className="container">
        <div className="options">
          <select
            onChange={(e) => setSort(e.target.value)}
            data-testid="sort"
            className="form-select"
            style={{}}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmited(search);
            }}
          >
            <input
              type="text"
              data-testid="search"
              onChange={(e) => setSearch(e.target.value)}
              className="form-input"
            />
            <input
              type="submit"
              value="Search"
              data-testid="submit"
              className="form-btn"
            />
          </form>
        </div>
        <div className="content">
          {loading ? (
            <h1
              style={{ width: "100%", textAlign: "center", marginTop: "20px" }}
            >
              Loading...
            </h1>
          ) : (
            photos.map((photo) => {
              return (
                <Card key={photo.id} photo={photo} deletePhoto={deletePhoto} />
              );
            })
          )}
        </div>
      </div>
    </>
  );
};

export default Photos;