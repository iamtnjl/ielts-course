/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import APIKit from "@/common/helpers/APIKit";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useState, useEffect, useRef, useMemo } from "react";

export default function RootContainer() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["home-data"],
    queryFn: async () => {
      const response = await APIKit.public.getCourse();
      return response.data;
    },
  });

  // Media gallery state
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isMobileVideoPlaying, setIsMobileVideoPlaying] = useState(false);
  const [isDesktopVideoPlaying, setIsDesktopVideoPlaying] = useState(false);

  // Tab and scroll state
  const [activeTab, setActiveTab] = useState(0);

  // Section refs
  const instructorRef = useRef<HTMLDivElement>(null);
  const courseStructureRef = useRef<HTMLDivElement>(null);
  const courseContentRef = useRef<HTMLDivElement>(null);
  const courseDetailsRef = useRef<HTMLDivElement>(null);

  const sections = useMemo(
    () => [
      { label: "কোর্স ইন্সট্রাক্টর", id: "instructor" },
      { label: "কোর্সটি কিভাবে সাজানো হয়েছে", id: "course-structure" },
      { label: "কোর্সটি করে যা শিখবেন", id: "course-content" },
      { label: "কোর্স সম্পর্কে বিস্তারিত", id: "course-details" },
    ],
    []
  );

  // Filter preview_gallery media items
  const previewMedia =
    data?.data?.media?.filter((item: any) => item.name === "preview_gallery") ||
    [];

  // Get current media item
  const currentMedia = previewMedia[currentMediaIndex] || previewMedia[0];

  // Navigation functions
  const handlePrevious = () => {
    setIsMobileVideoPlaying(false);
    setIsDesktopVideoPlaying(false);
    setCurrentMediaIndex((prev) =>
      prev === 0 ? previewMedia.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setIsMobileVideoPlaying(false);
    setIsDesktopVideoPlaying(false);
    setCurrentMediaIndex((prev) =>
      prev === previewMedia.length - 1 ? 0 : prev + 1
    );
  };

  // Handle thumbnail click
  const handleThumbnailClick = (index: number) => {
    setIsMobileVideoPlaying(false);
    setIsDesktopVideoPlaying(false);
    setCurrentMediaIndex(index);
  };

  // Handle video play for mobile
  const handleMobileVideoPlay = () => {
    setIsMobileVideoPlaying(true);
    setIsDesktopVideoPlaying(false);
  };

  // Handle video play for desktop
  const handleDesktopVideoPlay = () => {
    setIsDesktopVideoPlaying(true);
    setIsMobileVideoPlaying(false);
  };

  // Handle tab click and scroll to section
  const handleTabClick = (index: number) => {
    setActiveTab(index);
    const targetElement = document.getElementById(sections[index].id);
    if (targetElement) {
      const offsetTop = targetElement.offsetTop - 100; // Offset for sticky header
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  };

  // Add scroll detection for active tab
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i].id);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveTab(i);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [sections]);

  // Render media content
  const renderMediaContent = (media: any, isDesktop = false) => {
    if (!media) return null;

    if (media.resource_type === "video") {
      // Check if video should be playing based on device
      const shouldPlayVideo = isDesktop
        ? isDesktopVideoPlaying
        : isMobileVideoPlaying;

      // YouTube video
      if (shouldPlayVideo && media.resource_value) {
        return (
          <div className="relative w-full aspect-video">
            <iframe
              src={`https://www.youtube.com/embed/${media.resource_value}?autoplay=1&rel=0`}
              title="YouTube video player"
              className="w-full h-full absolute inset-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              frameBorder="0"
            />
          </div>
        );
      }

      return (
        <div className="relative">
          <Image
            width={1000}
            height={1000}
            alt="video thumbnail"
            src={
              media.thumbnail_url ||
              "https://cdn.10minuteschool.com/images/thumbnails/IELTS_new_16_9.png"
            }
            className="w-full object-cover"
          />
          <span
            className="absolute left-1/2 top-1/2 z-[2] -translate-x-1/2 -translate-y-1/2 cursor-pointer"
            onClick={isDesktop ? handleDesktopVideoPlay : handleMobileVideoPlay}
          >
            <svg
              width={isDesktop ? "60" : "60"}
              height={isDesktop ? "60" : "60"}
              viewBox="0 0 60 60"
              fill="none"
            >
              <circle cx="30" cy="30" r="30" fill="white" fillOpacity="0.9" />
              <path d="M24 20L24 40L40 30L24 20Z" fill="#1CAB55" />
            </svg>
          </span>
        </div>
      );
    } else if (media.resource_type === "image") {
      // Regular image
      return (
        <Image
          width={1000}
          height={1000}
          alt="course preview"
          src={media.resource_value}
          className="w-full object-cover"
        />
      );
    }

    return null;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-red-500">Error loading data</div>
      </div>
    );
  }

  console.log(data);

  return (
    <div className="">
      {/* Hero Section with Background */}
      <div
        className="min-h-[300px] md:min-h-[300px]"
        id="skills-landing"
        style={{
          backgroundImage:
            'url("https://cdn.10minuteschool.com/images/ui_%281%29_1716445506383.jpeg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Main Container with Two-Column Layout */}
        <div className="container mx-auto px-4 lg:px-8 xl:px-12 relative flex flex-col gap-4 md:flex-row md:gap-12 pb-6 md:py-10 min-h-[300px]">
          {/* Left Column - Course Information */}
          <div className="order-1 flex flex-col justify-center flex-1 md:order-1 md:max-w-[calc(100%_-_348px)] lg:max-w-[calc(100%_-_448px)] pt-8 md:pt-0 pb-4 md:pb-0">
            {/* Mobile Video Player (Hidden on Desktop) */}
            <div className="block mt-4 md:mt-0 md:hidden">
              <div className="relative overflow-hidden bg-black youtube-video aspect-video">
                {renderMediaContent(currentMedia, false)}

                {/* Navigation Controls */}
                {previewMedia.length > 1 && (
                  <>
                    <div
                      className="absolute left-[10px] top-1/2 -translate-y-1/2 z-[4] h-[25px] w-[25px] cursor-pointer"
                      onClick={handlePrevious}
                    >
                      <svg
                        width="25"
                        height="25"
                        viewBox="0 0 25 25"
                        fill="white"
                      >
                        <path
                          d="M15 7L9 12.5L15 18"
                          stroke="white"
                          strokeWidth="2"
                          fill="none"
                        />
                      </svg>
                    </div>
                    <div
                      className="absolute right-[10px] top-1/2 z-[4] -translate-y-1/2 h-[25px] w-[25px] cursor-pointer"
                      onClick={handleNext}
                    >
                      <svg
                        width="25"
                        height="25"
                        viewBox="0 0 25 25"
                        fill="white"
                      >
                        <path
                          d="M10 7L16 12.5L10 18"
                          stroke="white"
                          strokeWidth="2"
                          fill="none"
                        />
                      </svg>
                    </div>
                  </>
                )}
              </div>

              {/* Mobile Gallery Thumbnails */}
              {previewMedia.length > 1 && (
                <div className="flex gap-2 p-4 overflow-x-auto">
                  {previewMedia.map((media: any, index: number) => (
                    <div
                      key={index}
                      className={`flex-shrink-0 w-16 h-12 cursor-pointer border-2 rounded overflow-hidden ${
                        index === currentMediaIndex
                          ? "border-green-500"
                          : "border-gray-300"
                      }`}
                      onClick={() => handleThumbnailClick(index)}
                    >
                      <Image
                        width={1000}
                        height={1000}
                        src={
                          media.resource_type === "video"
                            ? media.thumbnail_url ||
                              "https://cdn.10minuteschool.com/images/thumbnails/IELTS_new_16_9.png"
                            : media.resource_value
                        }
                        alt={`thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {media.resource_type === "video" && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="white"
                            fillOpacity="0.8"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Course Title and Description */}
            <h1 className="text-white mb-4 text-[21px] font-semibold md:text-4xl md:mb-6">
              {data?.data.title}
            </h1>

            {/* Rating Section */}
            <div className="mb-4 md:mb-6">
              <button className="flex flex-row flex-wrap gap-2 text-white">
                <span className="inline-block">
                  <Image
                    width={1000}
                    height={1000}
                    className="md:w-[130px] w-[100px]"
                    src="https://cdn.10minuteschool.com/images/Dev_Handoff_Q1_24_Frame_2_1725444418666.png"
                    alt="rating"
                  />
                </span>
                <span className="inline-block text-sm md:text-base">
                  (82.6% শিক্ষার্থী কোর্স শেষে ৫ রেটিং দিয়েছেন)
                </span>
              </button>
            </div>

            {/* Course Description */}
            <div className="mb-4 md:mb-0">
              <div
                className="text-gray-400 text-sm md:text-base leading-relaxed"
                style={{
                  overflow: "hidden",
                  height: "auto",
                  maskImage: "none",
                }}
              >
                <div
                  dangerouslySetInnerHTML={{ __html: data?.data.description }}
                />
              </div>
            </div>
          </div>

          {/* Right Column - Pricing Sidebar */}
          <section className="w-full md:max-w-[330px] lg:max-w-[400px] order-2 bg-white absolute right-0 md:top-[50px]">
            <div className="md:sticky md:top-[112px]">
              <div className="md:border md:border-gray-200">
                {/* Desktop Video Player (Hidden on Mobile) */}
                <div className="hidden p-1 md:block">
                  <div className="relative overflow-hidden bg-black youtube-video aspect-video">
                    {renderMediaContent(currentMedia, true)}

                    {/* Desktop Navigation Controls */}
                    {previewMedia.length > 1 && (
                      <>
                        <div
                          className="absolute left-[10px] top-1/2 -translate-y-1/2 z-[4] h-[30px] w-[30px] cursor-pointer bg-white bg-opacity-90 rounded-full flex items-center justify-center hover:bg-opacity-100 shadow-md"
                          onClick={handlePrevious}
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 25 25"
                            fill="none"
                          >
                            <path
                              d="M15 7L9 12.5L15 18"
                              stroke="#6B7280"
                              strokeWidth="2"
                              fill="none"
                            />
                          </svg>
                        </div>
                        <div
                          className="absolute right-[10px] top-1/2 z-[4] -translate-y-1/2 h-[30px] w-[30px] cursor-pointer bg-white bg-opacity-90 rounded-full flex items-center justify-center hover:bg-opacity-100 shadow-md"
                          onClick={handleNext}
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 25 25"
                            fill="none"
                          >
                            <path
                              d="M10 7L16 12.5L10 18"
                              stroke="#6B7280"
                              strokeWidth="2"
                              fill="none"
                            />
                          </svg>
                        </div>

                        {/* Desktop Gallery Indicators */}
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
                          {previewMedia.map((_: any, index: number) => (
                            <button
                              key={index}
                              className={`w-2 h-2 rounded-full transition-colors ${
                                index === currentMediaIndex
                                  ? "bg-white"
                                  : "bg-white bg-opacity-50"
                              }`}
                              onClick={() => handleThumbnailClick(index)}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Desktop Gallery Thumbnails */}
                  {previewMedia.length > 1 && (
                    <div className="flex gap-2 p-2 overflow-x-auto">
                      {previewMedia
                        .filter(
                          (media: any) =>
                            media &&
                            (media.resource_value || media.thumbnail_url)
                        )
                        .map((media: any) => {
                          // Find the original index in the full previewMedia array
                          const originalIndex = previewMedia.findIndex(
                            (item: any) => item === media
                          );
                          return (
                            <div
                              key={originalIndex}
                              className={`flex-shrink-0 w-20 h-14 cursor-pointer border-2 rounded overflow-hidden transition-all relative ${
                                originalIndex === currentMediaIndex
                                  ? "border-green-500 scale-105"
                                  : "border-gray-300 hover:border-gray-400"
                              }`}
                              onClick={() =>
                                handleThumbnailClick(originalIndex)
                              }
                            >
                              <Image
                                width={1000}
                                height={1000}
                                src={
                                  media.resource_type === "video"
                                    ? media.thumbnail_url ||
                                      "https://cdn.10minuteschool.com/images/thumbnails/IELTS_new_16_9.png"
                                    : media.resource_value
                                }
                                alt={`thumbnail ${originalIndex + 1}`}
                                className="w-full h-full object-cover"
                              />
                              {media.resource_type === "video" && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <svg
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="white"
                                    fillOpacity="0.9"
                                  >
                                    <path d="M8 5v14l11-7z" />
                                  </svg>
                                </div>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>

                {/* Pricing Section */}
                <div className="hidden md:block">
                  <div className="w-full p-4 md:h-auto" id="variant">
                    <div className="relative md:static">
                      <div>
                        <div className="flex flex-col w-full">
                          <div>
                            <div className="flex items-center justify-between md:flex-col md:items-start">
                              <div className="md:mb-3">
                                <div className="inline-block text-2xl font-semibold">
                                  ৳3850
                                </div>
                                <span className="inline-flex">
                                  <del className="ml-2 text-base font-normal md:text-xl">
                                    ৳5000
                                  </del>
                                  <div className="inline-block bg-green-100 text-green-600 px-2 py-1 rounded ml-2">
                                    <p className="text-sm font-medium">
                                      1150 ৳ ছাড়
                                    </p>
                                  </div>
                                </span>
                              </div>
                            </div>
                          </div>
                          <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded whitespace-nowrap w-full">
                            {data?.data?.cta_text?.name}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Course Features List */}
                <div className="hidden md:block">
                  <div className="grid py-2 md:p-4">
                    <p className="mb-4 text-xl font-semibold">
                      এই কোর্সে যা থাকছে
                    </p>

                    {data?.data?.checklist.map((feature: any, index: any) => (
                      <div key={index}>
                        <div className="flex items-center mb-3 leading-5">
                          <div className="inline-block h-[20px] w-[20px]">
                            <Image
                              src={feature.icon}
                              alt="feature icon"
                              width="20"
                              height="20"
                            />
                          </div>
                          <h4 className="mb-0 inline-block pl-4 tracking-[0.005em] text-[#111827]">
                            {feature.text}
                          </h4>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* Contact Information */}
              <p className="justify-between hidden mt-4 text-sm text-center text-gray-400 md:flex md:flex-col lg:flex lg:flex-row">
                <span>কোর্সটি সম্পর্কে বিস্তারিত জানতে</span>
                <span className="flex items-center justify-center ml-2 underline cursor-pointer text-green-600">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="mr-1"
                  >
                    <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
                  </svg>
                  <span className="ml-1">ফোন করুন (16910)</span>
                </span>
              </p>
            </div>
          </section>
        </div>
      </div>

      {/* Mobile Course Features (Hidden on Desktop) */}
      <div className="block px-4 sm:px-6 lg:px-8 bg-white md:hidden">
        <div className="grid py-6 md:p-4">
          <p className="mb-4 text-xl font-semibold">এই কোর্সে যা থাকছে</p>

          {data?.data?.checklist.map((feature: any, index: any) => (
            <div key={index}>
              <div className="flex items-center mb-3 leading-5">
                <div className="inline-block h-[20px] w-[20px]">
                  <Image
                    src={feature.icon}
                    alt="feature icon"
                    width="20"
                    height="20"
                  />
                </div>
                <h4 className="mb-0 inline-block pl-4 tracking-[0.005em] text-[#111827]">
                  {feature.text}
                </h4>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="container mx-auto px-2 lg:px-0 flex flex-col gap-4 md:flex-row md:gap-12">
        <section className="order-2 flex-1 md:order-1 md:max-w-[calc(100%_-_348px)] lg:max-w-[calc(100%_-_448px)]">
          {/* Navigation Tabs (Sticky on Desktop) */}
          <div className="hidden bg-white md:block">
            <div className="relative">
              <div className="w-full overflow-hidden">
                <div className="flex gap-4 p-4 lg:p-6">
                  {sections.map((section, index) => (
                    <button
                      key={index}
                      onClick={() => handleTabClick(index)}
                      className={`px-4 py-2 text-sm font-medium rounded transition-colors duration-200 cursor-pointer ${
                        activeTab === index
                          ? "bg-green-100 text-green-600"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {section.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Content Sections */}
          <div className="p-0 lg:p-8 flex flex-col gap-8">
            <div ref={instructorRef} id="instructor">
              <h2
                id="instructor"
                className="mb-4 text-xl font-semibold md:text-2xl text-gray-800"
              >
                কোর্স ইন্সট্রাক্টর
              </h2>
              <div className="flex items-center p-4 border border-gray-200 w-full rounded-lg shadow-sm  bg-white">
                {/* Profile Image */}
                <Image
                  src="https://cdn.10minuteschool.com/images/skills/lp/ms_onset.jpg"
                  width={1000}
                  height={1000}
                  alt="Profile"
                  className="w-[73px] h-[73px] rounded-full border"
                />

                {/* Text Content */}
                <div className="ml-4">
                  <div className="flex items-center">
                    <h2 className="text-lg text-gray-800 hover:text-green">
                      Munzereen Shahid
                    </h2>
                  </div>
                  <p className="text-gray-700 text-sm">
                    MSc (English), University of Oxford (UK);
                    <br />
                    BA, MA (English), University of Dhaka;
                    <br />
                    IELTS: 8.5
                  </p>
                </div>
              </div>
            </div>
            <div ref={courseStructureRef} id="course-structure">
              <h2 className="text-xl font-semibold leading-[30px]mb-4 text-gray-800 mb-3">
                কোর্সটি যেভাবে সাজানো হয়েছে
              </h2>
              <div>
                <div className="mb-8 grid grid-cols-1 gap-4 rounded-md border bg-[#111827] p-6 md:grid-cols-2 md:gap-8">
                  {/* Feature 1 */}
                  <div className="flex flex-row items-start gap-3 m-1">
                    <div>
                      <div
                        className="mb-4 mx-auto opacity-0 transition-opacity duration-300 ease-in-out"
                        style={{ fontSize: "0px", opacity: 1 }}
                      >
                        <Image
                          alt="৫০+ ভিডিও লেকচার"
                          loading="lazy"
                          width="36"
                          height="36"
                          decoding="async"
                          style={{ color: "transparent" }}
                          src="https://s3.ap-southeast-1.amazonaws.com/cdn.10minuteschool.com/images/Group_1116604651_1684834874567.png"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col flex-1 gap-2">
                      <h2 className="text-[18px] font-medium leading-[26px] text-white">
                        ৫০+ ভিডিও লেকচার
                      </h2>
                      <h2 className="text-[14px] font-normal leading-[22px] text-[#9CA3AF]">
                        IELTS Academic ও General Training এর Overview, Format ও
                        প্রশ্নের ধরন নিয়ে in-depth আলোচনা
                      </h2>
                    </div>
                  </div>

                  {/* Feature 2 */}
                  <div className="flex flex-row items-start gap-3 m-1">
                    <div>
                      <div
                        className="mb-4 mx-auto opacity-0 transition-opacity duration-300 ease-in-out"
                        style={{ fontSize: "0px", opacity: 1 }}
                      >
                        <Image
                          alt="৩৮টি লেকচার শিট"
                          loading="lazy"
                          width="36"
                          height="36"
                          decoding="async"
                          style={{ color: "transparent" }}
                          src="https://s3.ap-southeast-1.amazonaws.com/cdn.10minuteschool.com/images/Group_1116604649_1684919669537.png"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col flex-1 gap-2">
                      <h2 className="text-[18px] font-medium leading-[26px] text-white">
                        ৩৮টি লেকচার শিট
                      </h2>
                      <h2 className="text-[14px] font-normal leading-[22px] text-[#9CA3AF]">
                        Reading, Writing, Listening ও Speaking এর প্রতিটি
                        প্রশ্নের উত্তর করার স্ট্র্যাটেজি এবং 600+ Vocabulary
                      </h2>
                    </div>
                  </div>

                  {/* Feature 3 */}
                  <div className="flex flex-row items-start gap-3 m-1">
                    <div>
                      <div
                        className="mb-4 mx-auto opacity-0 transition-opacity duration-300 ease-in-out"
                        style={{ fontSize: "0px", opacity: 1 }}
                      >
                        <Image
                          alt="রিডিং এন্ড লিসিনিং মক টেস্ট"
                          loading="lazy"
                          width="36"
                          height="36"
                          decoding="async"
                          style={{ color: "transparent" }}
                          src="https://s3.ap-southeast-1.amazonaws.com/cdn.10minuteschool.com/images/Group_1116604652_1684919731714.png"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col flex-1 gap-2">
                      <h2 className="text-[18px] font-medium leading-[26px] text-white">
                        রিডিং এন্ড লিসিনিং মক টেস্ট
                      </h2>
                      <h2 className="text-[14px] font-normal leading-[22px] text-[#9CA3AF]">
                        10 Reading ও 10 Listening Mock Tests এর মাধ্যমে
                        প্রস্তুতি যাচাই
                      </h2>
                    </div>
                  </div>

                  {/* Feature 4 */}
                  <div className="flex flex-row items-start gap-3 m-1">
                    <div>
                      <div
                        className="mb-4 mx-auto opacity-0 transition-opacity duration-300 ease-in-out"
                        style={{ fontSize: "0px", opacity: 1 }}
                      >
                        <Image
                          alt="ডাউট সল্ভিং লাইভ ক্লাস"
                          loading="lazy"
                          width="36"
                          height="36"
                          decoding="async"
                          style={{ color: "transparent" }}
                          src="https://s3.ap-southeast-1.amazonaws.com/cdn.10minuteschool.com/images/Group_1116604649_%281%29_1684919813933.png"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col flex-1 gap-2">
                      <h2 className="text-[18px] font-medium leading-[26px] text-white">
                        ডাউট সল্ভিং লাইভ ক্লাস
                      </h2>
                      <h2 className="text-[14px] font-normal leading-[22px] text-[#9CA3AF]">
                        সাপ্তাহিক জুম ক্লাসে এক্সপার্ট টিচারের কাছে প্রবলেম
                        সলভিং এর সুযোগ
                      </h2>
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    backgroundImage:
                      "url(https://cdn.10minuteschool.com/images/Free_class_card_BG_1722414654287.png)",
                    backgroundSize: "cover",
                  }}
                  className="flex gap-4 p-4 overflow-hidden md:p-8 rounded-xl w-full justify-between"
                >
                  {/* Left Section */}
                  <div className="">
                    <Image
                      width={1000}
                      height={1000}
                      src="https://cdn.10minuteschool.com/images/catalog/product/pointer/467478234_1276985680016189_8175110495169425888_n_1732621150265.png"
                      style={{ height: "40px", width: "189px" }}
                      className="mb-4"
                      alt="IELTS Pointer"
                    />
                    <h2
                      className="text-xl font-semibold"
                      style={{ color: "#ffffff" }}
                    >
                      IELTS Confirm 7+ Score (Guideline)
                    </h2>
                    <p className="mt-2 text-base" style={{ color: "#ededed" }}>
                      IELTS ভালো score করার সেরা Strategies জানুন সেরাদের
                      গাইডলাইনে।
                    </p>
                    <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded whitespace-nowrap w-fit mt-6">
                      ফ্রি PDF Download করুন
                    </button>
                  </div>

                  {/* Right Section */}
                  <div className="items-center hidden md:flex">
                    <Image
                      width={1000}
                      src="https://cdn.10minuteschool.com/images/catalog/product/pointer/Thumbnail_for_IELTS_Course_by_MS_1732621023962.jpg"
                      height={1000}
                      alt="IELTS Course Thumbnail"
                      className="h-[154px] w-[274px]"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div ref={courseContentRef} id="course-content">
              <h2 className="text-xl font-semibold leading-[30px]mb-4 text-gray-800 mb-3">
                কোর্সটি করে যা শিখবেন
              </h2>
              <div className="p-2 md:p-6 border border-gray-200 rounded-md">
                <ul className="grid grid-cols-1 gap-2 md:grid-cols-[1fr_1fr] md:gap-4">
                  <li className="flex items-start gap-2 mb-2">
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      strokeWidth="0"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                      className="mr-1 mt-[2px]"
                      style={{ color: "#6294F8" }}
                      height="20"
                      width="20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <div className="flex-1">
                      IELTS পরীক্ষার প্রত্যেক সেকশনের প্রশ্ন ও উত্তরের ধরন, টাইম
                      ম্যানেজমেন্ট সম্পর্কিত গুরুত্বপূর্ণ টিপস, ট্রিকস ও
                      স্ট্র্যাটেজি
                    </div>
                  </li>

                  <li className="flex items-start gap-2 mb-2">
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      strokeWidth="0"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                      className="mr-1 mt-[2px]"
                      style={{ color: "#6294F8" }}
                      height="20"
                      width="20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <div className="flex-1">
                      IELTS Writing Task 1 ও IELTS Writing Task 2 এর ক্ষেত্রে
                      ভালো স্কোর পেতে সহায়ক Structure ও Essay type
                    </div>
                  </li>

                  <li className="flex items-start gap-2 mb-2">
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      strokeWidth="0"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                      className="mr-1 mt-[2px]"
                      style={{ color: "#6294F8" }}
                      height="20"
                      width="20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <div className="flex-1">
                      IELTS Speaking test-এ Advanced/ Power Words ব্যবহার করে
                      যেকোনো টপিকে নির্ভুলভাবে কথা বলার পদ্ধতি
                    </div>
                  </li>

                  <li className="flex items-start gap-2 mb-2">
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      strokeWidth="0"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                      className="mr-1 mt-[2px]"
                      style={{ color: "#6294F8" }}
                      height="20"
                      width="20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <div className="flex-1">
                      সেরা IELTS প্রস্তুতি নিতে প্রতিটি মডিউলের নিয়ম-কানুনসহ
                      খুঁটিনাটি বিষয়াদি নিয়ে বিস্তারিত ধারণা
                    </div>
                  </li>

                  <li className="flex items-start gap-2 mb-2">
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      strokeWidth="0"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                      className="mr-1 mt-[2px]"
                      style={{ color: "#6294F8" }}
                      height="20"
                      width="20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <div className="flex-1">
                      IELTS পরীক্ষা চলাকালে নির্ধারিত সময়ের সঠিক ব্যবহারের
                      মাধ্যমে ভালো স্কোর অর্জনের কৌশল
                    </div>
                  </li>

                  <li className="flex items-start gap-2 mb-2">
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      strokeWidth="0"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                      className="mr-1 mt-[2px]"
                      style={{ color: "#6294F8" }}
                      height="20"
                      width="20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <div className="flex-1">
                      IELTS Reading এবং IELTS Listening Mock Test এর মাধ্যমে
                      IELTS পরীক্ষার রিয়েল এক্সপেরিয়েন্স ও Band Score সম্বন্ধে
                      পরিপূর্ণ ধারণা
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div ref={courseDetailsRef} id="course-details">
              <h2 className="text-xl font-semibold leading-[30px]mb-4 text-gray-800 mb-3">
                কোর্স সম্পর্কে বিস্তারিত
              </h2>
              <div className="rounded-lg py-2 border border-gray-200 px-5">
                {/* Section 1 */}
                <details
                  className="mb-0 border-b border-gray-200 last:border-none"
                  open
                >
                  <summary className="py-4 cursor-pointer flex items-center justify-between">
                    <div className="font-medium md:text-base mx-lg:text-sm">
                      <h2>
                        <b>IELTS Course-টি যাদের জন্য</b>
                      </h2>
                    </div>
                    <svg
                      className="w-5 h-5 transform transition-transform duration-300 ease-in-out"
                      style={{ transform: "rotate(180deg)" }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </summary>
                  <div className="px-0 pb-4 text-gray-500 transition-all duration-300 ease-in-out">
                    <div className="prose prose-ul:pl-4">
                      <ul>
                        <li>
                          যারা উচ্চশিক্ষা, মাইগ্রেশন বা চাকরির জন্য বিদেশে যেতে
                          চান।
                        </li>
                        <li>
                          যারা উচ্চশিক্ষা শেষে বা দেশে বসবাসরত অবস্থায় বিদেশে
                          স্থায়ীভাবে বসবাসের জন্য আবেদন করতে চান।
                        </li>
                        <li>
                          IELTS পরীক্ষা যাদের জন্য ভীতিকর, কিংবা যারা IELTS
                          প্রস্তুতি কোথা থেকে শুরু করবেন তা জানেন না।
                        </li>
                        <li>
                          যারা আগে পরীক্ষা দিয়েছেন কিন্তু নিজের IELTS Band Score
                          বাড়াতে চান।
                        </li>
                        <li>
                          যারা চাকরি বা ব্যবসার কাজে কিংবা ব্যক্তিগত আগ্রহে
                          নিজেদের reading, writing, listening এবং speaking
                          দক্ষতা বাড়াতে চান।
                        </li>
                        <li>
                          স্টুডেন্ট কিংবা চাকরিজীবীদের মধ্যে যারা ব্যস্ততার
                          কারনে ঘরে বসেই IELTS এর জন্য সেরা প্রস্তুতি নিতে চান।
                        </li>
                      </ul>
                    </div>
                  </div>
                </details>

                {/* Section 2 */}
                <details className="mb-0 border-b border-gray-200 last:border-none">
                  <summary className="py-4 cursor-pointer flex items-center justify-between">
                    <div className="font-medium md:text-base mx-lg:text-sm">
                      <h2>
                        <b>IELTS Course-টি কোর্স সম্পর্কে</b>
                      </h2>
                    </div>
                    <svg
                      className="w-5 h-5 transform transition-transform duration-300 ease-in-out"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </summary>
                  <div className="px-0 pb-4 text-gray-500 transition-all duration-300 ease-in-out">
                    <div className="prose prose-ul:pl-4">
                      <p>
                        যুক্তরাষ্ট্রের ৩,৪০০ প্রতিষ্ঠানসহ পৃথিবীর ১১ হাজারেরও
                        বেশি প্রতিষ্ঠানে IELTS exam score এর গ্রহণযোগ্যতা রয়েছে।
                        এই পরীক্ষায় অত্যন্ত সুনিপুণভাবে পরীক্ষার্থীর ইংরেজি বলা,
                        পড়া, শোনা ও লেখার ক্ষমতাকে যাচাই করা হয়।
                      </p>
                      <br />

                      <p>
                        বিদেশি ভাষা হওয়ায় অনেকেই ইংরেজি গ্রামার নিয়ে ভয়ে থাকেন।
                        তবে আনন্দের কথা হলো, IELTS পরীক্ষাটি ব্যাকরণভিত্তিক নয়।
                        এটি মূলত একটি ভাষাভিত্তিক নিরীক্ষা পদ্ধতি। কাঙ্ক্ষিত
                        স্কোর অর্জনের জন্য ইংরেজি ভাষার চারটি দক্ষতা আপনার
                        প্রয়োজন: পড়তে পারা, লিখতে পারা, শুনে বুঝতে পারা, ও বলতে
                        পারা। এই চারটি ক্ষেত্রে যিনি যত দক্ষ হবেন, IELTS
                        পরীক্ষায় তিনি তত ভালো স্কোর পাবেন।
                      </p>
                      <br />

                      <p>
                        ইংরেজি ভাষার এই চারটি অত্যাবশ্যক দক্ষতা বাড়াতে টেন মিনিট
                        স্কুল নিয়ে এসেছে{" "}
                        <a
                          href="https://10minuteschool.com/ielts"
                          style={{ color: "blue" }}
                        >
                          IELTS
                        </a>{" "}
                        পরীক্ষার্থীদের জন্য বিশেষভাবে সাজানো এই IELTS Course-টি
                        কোর্সটির শিক্ষক মুনজেরিন শহীদ (IELTS ব্যান্ড স্কোর
                        8.5/9) ইংল্যান্ডের বিশ্বখ্যাত অক্সফোর্ড বিশ্ববিদ্যালয়ের
                        Department of Education হতে Applied Linguistics and
                        Second Language Acquisition বিষয়ে স্নাতকোত্তর ডিগ্রী
                        গ্রহণ করেছেন।
                      </p>
                      <br />

                      <p>
                        আমাদের এই কোর্সটিতে এনরোল করলেই পাবেন মুনজেরিন শহীদের
                        “ঘরে বসে IELTS প্রস্তুতি” বইটি সম্পূর্ণ ফ্রিতে! কোর্সের
                        ভিডিও লেকচারের পাশাপাশি বই থেকে স্ট্র্যাটেজি শিখে ও
                        প্র্যাকটিস করে সম্পূর্ণ প্রস্তুতি নিতে পারবেন। এই
                        কোর্সটিতে আরও থাকছে IELTS Reading ও Listening Mock Test,
                        যা আপনাকে দিবে IELTS পরীক্ষার রিয়েল এক্সপেরিয়েন্স এবং
                        ব্যান্ড স্কোর সম্বন্ধে ধারণা। এছাড়াও প্র্যাক্টিসের সময়
                        যেকোনো প্রবলেমের সমাধানের জন্য রয়েছে Expert
                        Instructor-দের Problem Solving Live class। সুতরাং এবার
                        এক IELTS Course-এ থাকছে Complete IELTS Preparation!
                      </p>
                      <br />

                      <p>
                        আপনার IELTS পরীক্ষাকে আরো সহজ, উপভোগ্য ও ফলপ্রসূ করতে
                        এবং কাঙ্ক্ষিত ব্যান্ড স্কোরটি পেতে আজই এনরোল করুন “IELTS
                        Course by Munzereen Shahid”-এ, আর নিজেকে এগিয়ে নিয়ে যান
                        আপনার স্বপ্নপূরণের দ্বারপ্রান্তে।
                      </p>
                    </div>
                  </div>
                </details>

                {/* Section 3 */}
                <details className="mb-0 border-b border-gray-200 last:border-none">
                  <summary className="py-4 cursor-pointer flex items-center justify-between">
                    <div className="font-medium md:text-base mx-lg:text-sm">
                      <h2>
                        <b>এই IELTS Course-টি আপনাকে যেভাবে সাহায্য করবে</b>
                      </h2>
                    </div>
                    <svg
                      className="w-5 h-5 transform transition-transform duration-300 ease-in-out"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </summary>
                  <div className="px-0 pb-4 text-gray-500 transition-all duration-300 ease-in-out">
                    <div className="prose prose-ul:pl-4">
                      <ul>
                        <li>
                          “Academic IELTS” ও “General Training IELTS” - উভয়
                          মডিউলের জন্যই কার্যকরভাবে ঘরে বসে প্রস্তুতি নিতে
                          পারবেন। এই IELTS Course টিতে দুটো মডিউলের জন্যই আলাদা
                          দুটো সেকশন রয়েছে।
                        </li>
                        <li>
                          IELTS speaking, reading, listening ও writing test-এর
                          প্রশ্নের ধরন অনুযায়ী টিপস, হ্যাকস ও টেকনিক শিখতে
                          পারবেন।
                        </li>
                        <li>
                          IELTS এর সব ধরনের প্রশ্ন সঠিকভাবে সমাধান করে হাতে কলমে
                          প্রস্তুতি নিতে পারবেন।
                        </li>
                        <li>
                          ভিডিও দেখার পাশাপাশি IELTS Course-এ থাকা লেকচার শিট,
                          “ঘরে বসে IELTS প্রস্তুতি” বই এবং Doubt Solving Live
                          Class-এর মাধ্যমে নিতে পারবেন কমপ্লিট প্রিপারাশন।
                        </li>
                        <li>
                          কোর্স শেষ করার পর IELTS Reading and Listening mock
                          test প্রশ্ন সল্‌ভ করার মাধ্যমে নিজের IELTS প্রস্তুতি
                          ঝালিয়ে নিতে পারবেন।
                        </li>
                      </ul>
                    </div>
                  </div>
                </details>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold leading-[30px]mb-4 text-gray-800 mb-3">
                কোর্স এক্সক্লুসিভ ফিচার
              </h2>
              <div className="grid grid-cols-1 px-5 border border-gray-200 divide-y divide-gray-200 rounded-md">
                {/* First Feature Block */}
                <div className="flex flex-col items-start justify-between gap-3 py-5 md:flex-row">
                  {/* Text Content */}
                  <div className="flex flex-col gap-2">
                    <h2 className="text-[14px] font-[500] leading-[30px] text-[#111827] md:text-[16px]">
                      ভিডিও লেকচার
                    </h2>

                    {/* Feature List */}
                    <div className="flex flex-row items-center gap-5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="19"
                        height="15"
                        fill="none"
                        viewBox="0 0 19 15"
                      >
                        <path
                          fill="#6294F8"
                          stroke="#6294F8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="0.893"
                          d="M18.168 1.508a.792.792 0 01-.006 1.111L6.645 14.143a.77.77 0 01-1.087.005L.77 9.433a.792.792 0 01-.015-1.11.77.77 0 011.098-.016l4.242 4.177L17.07 1.502a.77.77 0 011.098.006z"
                        />
                      </svg>
                      <p className="text-[14px] font-[400] leading-[24px] text-[#4B5563] md:text-[16px]">
                        IELTS Academic ও General Training নিয়ে আলোচনা
                      </p>
                    </div>

                    <div className="flex flex-row items-center gap-5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="19"
                        height="15"
                        fill="none"
                        viewBox="0 0 19 15"
                      >
                        <path
                          fill="#6294F8"
                          stroke="#6294F8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="0.893"
                          d="M18.168 1.508a.792.792 0 01-.006 1.111L6.645 14.143a.77.77 0 01-1.087.005L.77 9.433a.792.792 0 01-.015-1.11.77.77 0 011.098-.016l4.242 4.177L17.07 1.502a.77.77 0 011.098.006z"
                        />
                      </svg>
                      <p className="text-[14px] font-[400] leading-[24px] text-[#4B5563] md:text-[16px]">
                        Reading, Writing, Listening ও Speaking এর Overview &amp;
                        Format
                      </p>
                    </div>

                    <div className="flex flex-row items-center gap-5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="19"
                        height="15"
                        fill="none"
                        viewBox="0 0 19 15"
                      >
                        <path
                          fill="#6294F8"
                          stroke="#6294F8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="0.893"
                          d="M18.168 1.508a.792.792 0 01-.006 1.111L6.645 14.143a.77.77 0 01-1.087.005L.77 9.433a.792.792 0 01-.015-1.11.77.77 0 011.098-.016l4.242 4.177L17.07 1.502a.77.77 0 011.098.006z"
                        />
                      </svg>
                      <p className="text-[14px] font-[400] leading-[24px] text-[#4B5563] md:text-[16px]">
                        প্রতিটি প্রশ্নের ধরন-ভিত্তিক উত্তর করার স্ট্র্যাটেজি
                      </p>
                    </div>

                    <div className="flex flex-row items-center gap-5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="19"
                        height="15"
                        fill="none"
                        viewBox="0 0 19 15"
                      >
                        <path
                          fill="#6294F8"
                          stroke="#6294F8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="0.893"
                          d="M18.168 1.508a.792.792 0 01-.006 1.111L6.645 14.143a.77.77 0 01-1.087.005L.77 9.433a.792.792 0 01-.015-1.11.77.77 0 011.098-.016l4.242 4.177L17.07 1.502a.77.77 0 011.098.006z"
                        />
                      </svg>
                      <p className="text-[14px] font-[400] leading-[24px] text-[#4B5563] md:text-[16px]">
                        ভিডিওর সাথে প্র্যাকটিসের সুযোগ
                      </p>
                    </div>
                  </div>

                  {/* Image */}
                  <div className="w-full md:w-auto">
                    <div
                      className="mb-4 mx-auto opacity-0 transition-opacity duration-300 ease-in-out"
                      style={{ fontSize: 0, opacity: 1 }}
                    >
                      <Image
                        alt="ভিডিও লেকচার"
                        loading="lazy"
                        width={250}
                        height={200}
                        decoding="async"
                        style={{ color: "transparent" }}
                        src="https://cdn.10minuteschool.com/images/k-12-courses/ielts_mock_sqr.png"
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Second Feature Block */}
                <div className="flex flex-col items-start justify-between gap-3 py-5 md:flex-row">
                  <div className="flex flex-col gap-2">
                    <h2 className="text-[14px] font-[500] leading-[30px] text-[#111827] md:text-[16px]">
                      Reading ও Listening Mock Tests
                    </h2>

                    <div className="flex flex-row items-center gap-5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="19"
                        height="15"
                        fill="none"
                        viewBox="0 0 19 15"
                      >
                        <path
                          fill="#6294F8"
                          stroke="#6294F8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="0.893"
                          d="M18.168 1.508a.792.792 0 01-.006 1.111L6.645 14.143a.77.77 0 01-1.087.005L.77 9.433a.792.792 0 01-.015-1.11.77.77 0 011.098-.016l4.242 4.177L17.07 1.502a.77.77 0 011.098.006z"
                        />
                      </svg>
                      <p className="text-[14px] font-[400] leading-[24px] text-[#4B5563] md:text-[16px]">
                        10 Reading &amp; 10 Listening Mock Tests
                      </p>
                    </div>

                    <div className="flex flex-row items-center gap-5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="19"
                        height="15"
                        fill="none"
                        viewBox="0 0 19 15"
                      >
                        <path
                          fill="#6294F8"
                          stroke="#6294F8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="0.893"
                          d="M18.168 1.508a.792.792 0 01-.006 1.111L6.645 14.143a.77.77 0 01-1.087.005L.77 9.433a.792.792 0 01-.015-1.11.77.77 0 011.098-.016l4.242 4.177L17.07 1.502a.77.77 0 011.098.006z"
                        />
                      </svg>
                      <p className="text-[14px] font-[400] leading-[24px] text-[#4B5563] md:text-[16px]">
                        Computer-delivered IELTS পরীক্ষার এক্সপেরিয়েন্স
                      </p>
                    </div>

                    <div className="flex flex-row items-center gap-5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="19"
                        height="15"
                        fill="none"
                        viewBox="0 0 19 15"
                      >
                        <path
                          fill="#6294F8"
                          stroke="#6294F8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="0.893"
                          d="M18.168 1.508a.792.792 0 01-.006 1.111L6.645 14.143a.77.77 0 01-1.087.005L.77 9.433a.792.792 0 01-.015-1.11.77.77 0 011.098-.016l4.242 4.177L17.07 1.502a.77.77 0 011.098.006z"
                        />
                      </svg>
                      <p className="text-[14px] font-[400] leading-[24px] text-[#4B5563] md:text-[16px]">
                        উত্তর সাবমিট করার সাথে সাথেই রেজাল্ট
                      </p>
                    </div>

                    <div className="flex flex-row items-center gap-5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="19"
                        height="15"
                        fill="none"
                        viewBox="0 0 19 15"
                      >
                        <path
                          fill="#6294F8"
                          stroke="#6294F8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="0.893"
                          d="M18.168 1.508a.792.792 0 01-.006 1.111L6.645 14.143a.77.77 0 01-1.087.005L.77 9.433a.792.792 0 01-.015-1.11.77.77 0 011.098-.016l4.242 4.177L17.07 1.502a.77.77 0 011.098.006z"
                        />
                      </svg>
                      <p className="text-[14px] font-[400] leading-[24px] text-[#4B5563] md:text-[16px]">
                        যেকোনো সময়, যেকোনো জায়গা থেকে মক টেস্ট
                      </p>
                    </div>
                  </div>

                  {/* Image */}
                  <div className="w-full md:w-auto">
                    <div
                      className="mb-4 mx-auto opacity-0 transition-opacity duration-300 ease-in-out"
                      style={{ fontSize: 0, opacity: 1 }}
                    >
                      <Image
                        alt="Reading ও Listening Mock Tests"
                        loading="lazy"
                        width={250}
                        height={200}
                        decoding="async"
                        style={{ color: "transparent" }}
                        src="https://cdn.10minuteschool.com/images/k-12-courses/ielts_mock_book_sqr.png"
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
