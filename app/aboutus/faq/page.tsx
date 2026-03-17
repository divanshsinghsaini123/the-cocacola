import { GetContactUsPageData } from "../../../src/lib/strapi";
import FaqClient from "./FaqClient";
import { notFound } from "next/navigation";

export default async function FaqPage() {
    const data = await GetContactUsPageData();
    if (data?.DisablePage) return notFound();
    const questionanswers = data?.FAQ?.question_answer || [];

    return <FaqClient questionanswers={questionanswers} />;
}
