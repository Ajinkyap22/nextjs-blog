import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const postsDirectory = path.join(process.cwd(), "posts");

export function getSortedPostsData() {
  // get file names
  const fileNames = fs.readdirSync(postsDirectory);

  const allPostsData = fileNames.map((fileName) => {
    // remove .md from fileName
    const id = fileName.replace(/\.md$/, "");

    // read markdown file as string
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf-8");

    // parse data with gray-matter
    const matterResult = matter(fileContents);

    // return data along with id
    return {
      id,
      ...(matterResult.data as { title: string; date: string }),
    };
  });

  // sort the data by date
  return allPostsData.sort((a, b) =>
    a.date < b.date ? 1 : a.date === b.date ? 0 : -1
  );
}

export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory);

  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, ""),
      },
    };
  });
}

export async function getPostData(id: string) {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf-8");

  const matterresult = matter(fileContents);

  // convert markdown to html string
  const processedContent = await remark()
    .use(html)
    .process(matterresult.content);

  const contentHtml = processedContent.toString();

  return {
    id,
    contentHtml,
    ...(matterresult.data as { title: string; date: string }),
  };
}
