import { SiteContent } from "./types";

export const DEFAULT_SITE_CONTENT: SiteContent = {
  hero: {
    eyebrow: "/ REDDIX ROBOTICS • CEO",
    name: "RAJA RAJESHWAR",
    subtitle: "REDDY PATURI",
    taglinePrimary: "Building autonomous systems",
    taglineSecondary: "from algorithms to hardware",
    ctaLabel: "Get in touch",
    ctaLink: "#about",
    hudLocation: "REDDIX LABS",
    hudTimezone: "GMT+5:30",
  },
  about: {
    title: "ENGINEERING ROBUST INTELLIGENCE IN PHYSICAL SPACE",
    leadParagraph:
      "Specializing in Autonomous Mobile Robots (AMRs), SLAM navigation, ROS 2 pipelines, and custom embedded motor controllers.",
    bioParagraph:
      "I bridge the boundary between mechanical kinematics, real-time embedded firmware, and modern web telemetry dashboards. From designing anodized dual-tier chassis and LiDAR integration to path-planning algorithms navigating dense environments.",
    focusAreas: [
      "LiDAR-based SLAM & 2D/3D Point Cloud Mapping",
      "ROS 2 Humble / Iron Navigation Stack (Nav2)",
      "High-speed BLDC & Stepper Motor Closed-Loop Control",
      "Computer Vision & Edge TensorRT Neural Inference",
      "Real-time Telemetry & WebRTC Robot Remote Operation",
    ],
    skills: [
      {
        category: "Robotics & Perception",
        items: ["ROS 2", "Nav2", "Cartographer", "RPLIDAR", "OpenCV", "Gazebo", "URDF"],
      },
      {
        category: "Embedded & Hardware",
        items: ["STM32", "Raspberry Pi", "NVIDIA Jetson", "CAN bus", "I2C/SPI", "KiCAD PCB"],
      },
      {
        category: "Software & Web",
        items: ["C++20", "Python", "TypeScript", "Next.js", "Three.js", "WebSockets"],
      },
    ],
  },
  projects: [
    {
      id: "reddix-amr-v1",
      title: "REDDIX AMR-01 SLAM ROVER",
      category: "Autonomous Mobile Robotics",
      year: "2024",
      description:
        "Dual-tier differential drive autonomous mobile robot equipped with 360° RPLIDAR, ultrasonic obstacle avoidance, and live camera feed running ROS 2 Nav2 stack.",
      technologies: ["ROS 2", "RPLIDAR", "Python", "C++", "Jetson Nano", "SolidWorks"],
      metrics: "< 3cm SLAM localization accuracy in indoor multi-room environments",
      githubUrl: "https://github.com",
    },
    {
      id: "telemetry-hud",
      title: "WEB-BASED ROBOT TELEMETRY & HUD",
      category: "Full-Stack WebRTC Platform",
      year: "2024",
      description:
        "Sub-100ms latency browser-based remote teleoperation portal streaming 3D point clouds via WebGL, live battery state of charge, and map waypoint dispatching.",
      technologies: ["Next.js", "Three.js", "WebRTC", "WebSockets", "FastAPI"],
      metrics: "60 FPS 3D point cloud rendering with 85ms end-to-end telemetry latency",
      githubUrl: "https://github.com",
    },
    {
      id: "bldc-field-oriented-control",
      title: "DUAL-CHANNEL FOC MOTOR CONTROLLER",
      category: "Embedded Firmware & Power Electronics",
      year: "2023",
      description:
        "Custom 48V/30A motor controller board featuring Field Oriented Control (FOC) with magnetic encoder feedback for silent, ripple-free low-speed torque.",
      technologies: ["STM32F4", "C++", "KiCad", "CAN bus", "FreeRTOS"],
      metrics: "96.4% peak electrical efficiency under dynamic payload loads",
      githubUrl: "https://github.com",
    },
    {
      id: "edge-object-detector",
      title: "LOW-LIGHT INDUSTRIAL OBSTACLE RECOGNITION",
      category: "Edge AI & Computer Vision",
      year: "2023",
      description:
        "YOLOv8 model optimized via TensorRT for real-time obstacle segmentation and hazard classification deployed directly on an embedded Jetson edge accelerator.",
      technologies: ["PyTorch", "TensorRT", "CUDA", "OpenCV", "DeepStream"],
      metrics: "48 FPS inference at 640x640 resolution with 4.8W power draw",
      githubUrl: "https://github.com",
    },
  ],
  career: [
    {
      id: "lead-robotics-eng",
      role: "Founder & CEO",
      organization: "Reddix Robotics",
      period: "2023 — Present",
      location: "Bengaluru, IN",
      summary:
        "Architecting autonomous mobile robot platforms, sensor fusion algorithms, and low-latency cloud fleet management software.",
      achievements: [
        "Delivered end-to-end hardware & software architecture for AMR-01 with autonomous dock recharge.",
        "Engineered custom ROS 2 Nav2 plugins reducing tight-hallway navigation stalls by 40%.",
        "Built WebGL-powered 3D visualization dashboard for real-time robot fleet status.",
      ],
    },
    {
      id: "embedded-systems-eng",
      role: "Embedded Systems & Firmware Engineer",
      organization: "Nexus Automation",
      period: "2022 — 2023",
      location: "Remote",
      summary:
        "Developed bare-metal and FreeRTOS firmware for industrial sensor hubs and motor drivers over CAN bus.",
      achievements: [
        "Programmed STM32-based multi-sensor acquisition units running at 1 kHz sample rates.",
        "Implemented fail-safe watchdog architectures meeting ISO 13849 machinery safety standards.",
      ],
    },
    {
      id: "robotics-fellow",
      role: "Mechatronics Research Fellow",
      organization: "Autonomous Robotics Lab",
      period: "2021 — 2022",
      location: "University Research",
      summary:
        "Researched visual-inertial odometry (VIO) and sensor fusion in GPS-denied environments.",
      achievements: [
        "Published research on extended Kalman filter (EKF) sensor fusion fusing IMU + optical flow.",
        "Awarded best design for miniature differential drive search-and-rescue rover.",
      ],
    },
  ],
  achievements: [
    {
      id: "top-robotics-innovation",
      title: "Top Autonomous Robotics Innovation Award",
      date: "OCT 2026",
      issuer: "National Robotics Forum 2026",
      description:
        "Recognized for pioneering multi-agent autonomous navigation and real-time obstacle evasion algorithms.",
      metric: "1st Place Winner",
    },
    {
      id: "national-robotics-award",
      title: "1st Place — National Autonomous Robotics Challenge",
      date: "OCT 2023",
      issuer: "Robotics Innovation Forum",
      description:
        "Won 1st prize for autonomous obstacle negotiation and dynamic replanning in an unknown maze layout.",
      metric: "Rank #1 / 84 Teams",
    },
    {
      id: "open-source-contributor",
      title: "ROS 2 Navigation Ecosystem Contributor",
      date: "2024",
      issuer: "Open Source Robotics Foundation",
      description:
        "Contributed bug fixes and documentation to Nav2 costmap recovery behaviors and lifecycle managers.",
      metric: "5+ Merged PRs",
    },
    {
      id: "patent-filing",
      title: "Patent Filed: Modular Tiered AMR Suspension & Swivel Mounting",
      date: "JAN 2024",
      issuer: "Intellectual Property Office",
      description:
        "Novel mechanical coupling mechanism allowing rapid field replacement of sensor pods without chassis disassembly.",
      metric: "Patent Pending",
    },
  ],
};
