import React from 'react';

export function ShimmerLoader() {
  return (
    <div className="animate-pulse">
      <div className="h-64 bg-gray-300 rounded-lg mb-4 shimmer"></div>
      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2 shimmer"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2 shimmer"></div>
    </div>
  );
}

export function DotsLoader() {
  return (
    <div className="flex justify-center items-center space-x-2">
      <div className="w-3 h-3 bg-hednor-gold rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
      <div className="w-3 h-3 bg-hednor-gold rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
      <div className="w-3 h-3 bg-hednor-gold rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
    </div>
  );
}

export function SpinnerLoader() {
  return (
    <div className="flex justify-center items-center">
      <div className="w-8 h-8 border-4 border-hednor-gold border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

export function PulseLoader() {
  return (
    <div className="flex justify-center items-center">
      <div className="w-4 h-4 bg-hednor-gold rounded-full animate-pulse mx-1"></div>
      <div className="w-4 h-4 bg-hednor-gold rounded-full animate-pulse mx-1" style={{ animationDelay: '0.2s' }}></div>
      <div className="w-4 h-4 bg-hednor-gold rounded-full animate-pulse mx-1" style={{ animationDelay: '0.4s' }}></div>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="border rounded-lg p-4 animate-pulse">
      <div className="h-48 bg-gray-300 rounded-lg mb-4 shimmer"></div>
      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2 shimmer"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2 mb-2 shimmer"></div>
      <div className="h-6 bg-gray-300 rounded w-1/4 shimmer"></div>
    </div>
  );
}