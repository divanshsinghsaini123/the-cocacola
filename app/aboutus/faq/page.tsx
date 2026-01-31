import { GetContactUsPageData } from "../../../src/lib/strapi";
import FaqClient from "./FaqClient";

export default async function FaqPage() {
    const data = await GetContactUsPageData();
    const questionanswers = data?.FAQ?.question_answer || [];

    return <FaqClient questionanswers={questionanswers} />;
}
