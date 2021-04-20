import { useState } from "react";
import { useForm } from "react-hook-form";
import styles from "./form.module.css";

interface FormValues {
  title: string;
  keywords: string;
  category: string;
  text: string;
}

interface ScoreResponse {
  status: "ok" | "error";
  result: number;
}

const Form = () => {
  const [shares, setShares] = useState<number>();
  const { register, handleSubmit } = useForm<FormValues>();

  const fetchScore = (payload: FormValues) => {
    fetch("/api/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...payload,
        keywords: payload.keywords.split(","),
        images: [],
        movies: [],
        num_links: 3,
        date: new Date().toUTCString(),
      }),
    })
      .then<ScoreResponse>((res) => res.json())
      .then((res) => setShares(res.result));
  };

  return (
    <div className={styles.container}>
      {shares && (
        <p className={styles.shares}>Your article will get {shares} shares.</p>
      )}
      <form className={styles.form} onSubmit={handleSubmit(fetchScore)}>
        <input
          className={styles.title}
          placeholder="Title.."
          type="text"
          {...register("title", { required: true })}
        />
        <div className={styles.group}>
          <input
            className={styles.keywords}
            placeholder="enter,comma,separated,keywords"
            type="text"
            {...register("keywords", { required: true })}
          />
          <input
            className={styles.category}
            placeholder="Category"
            type="text"
            {...register("category", { required: true })}
          />
        </div>
        <textarea
          placeholder="Start writing your article..."
          {...register("text", { required: true })}
        />
        <button type="submit" className={styles.submit}>
          Check Score
        </button>
      </form>
    </div>
  );
};

export default Form;
