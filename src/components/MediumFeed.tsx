"use client";

import { useEffect, useState } from "react";
import Parser from "rss-parser";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MediumPost {
  title: string;
  link: string;
  pubDate: string;
}

export default function MediumFeed() {
  const [posts, setPosts] = useState<MediumPost[]>([]);

  useEffect(() => {
    const fetchMediumPosts = async () => {
      const CORS_PROXY = "https://api.allorigins.win/get?url=";
      const RSS_URL = encodeURIComponent("https://medium.com/feed/@kullaniciadi"); // Medium kullanıcı adınızı değiştirin
      const parser = new Parser();

      try {
        const response = await fetch(`${CORS_PROXY}${RSS_URL}`);
        const data = await response.json();
        const feed = await parser.parseString(data.contents);
        const latestPosts = feed.items?.slice(0, 5).map(item => ({
          title: item.title ?? "",
          link: item.link ?? "",
          pubDate: item.pubDate ?? "",
        })) ?? [];
        setPosts(latestPosts);
      } catch (error) {
        console.error("Medium feed fetch error:", error);
      }
    };

    fetchMediumPosts();
  }, []);

  return (
    <section id="blog" className="my-20 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-10">My Medium Articles</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{post.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{new Date(post.pubDate).toLocaleDateString()}</p>
              <a
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Read more
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
