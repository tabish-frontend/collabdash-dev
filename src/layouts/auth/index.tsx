// import { useMediaQuery, useTheme } from "@mui/material";
// import Box from "@mui/material/Box";
// import Stack from "@mui/material/Stack";
// import Typography from "@mui/material/Typography";
// import PropTypes from "prop-types";
// import type { FC, ReactNode } from "react";

// import { GuestGuard } from "src/components";
// import {
//   Logo,
//   LogoAccenture,
//   LogoAtt,
//   LogoAws,
//   LogoBolt,
//   LogoSamsung,
//   LogoVisma,
// } from "src/components/shared";

// interface LayoutProps {
//   children: ReactNode;
// }

// export const AuthLayout: FC<LayoutProps> = (props) => {
//   const { children } = props;

//   const theme = useTheme();
//   const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

//   const component = (
//     <Box
//       sx={{
//         backgroundColor: "background.default",
//         display: "flex",
//         flex: "1 1 auto",
//         mt: isSmallScreen ? 15 : 0,
//         flexDirection: {
//           // xs: "column-reverse",
//           xs: "column",
//           md: "row",
//         },
//       }}
//     >
//       <Box
//         sx={{
//           alignItems: "center",
//           backgroundImage: !isSmallScreen ? 'url("/assets/auth_bg.svg")' : "",
//           backgroundPosition: "top center",
//           backgroundRepeat: "no-repeat",
//           backgroundSize: "cover",
//           backgroundOrigin: "border-box",
//           color: "common.white",
//           display: "flex",
//           flex: {
//             xs: "0 0 auto",
//             md: "1 1 auto",
//           },
//           justifyContent: "center",
//           p: {
//             xs: 3,
//             md: 7,
//           },
//         }}
//       >
//         <Box maxWidth="md">
//           <Box
//             justifyContent={"center"}
//             alignItems={"center"}
//             display={"flex"}
//             flexDirection={"column"}
//           >
//             <Box
//               sx={{
//                 // height: "50%",
//                 // width: "50%",
//                 height: isSmallScreen ? "100%" : "150%",
//                 width: isSmallScreen ? "100%" : "150%",
//                 // width: "150%",
//                 // height: "150%",
//                 display: "flex",
//                 p: "3px",
//               }}
//             >
//               <Logo color={isSmallScreen ? "#2B91BD" : "#F3F3F3"} />
//             </Box>

//             {!isSmallScreen && (
//               <Box
//                 sx={{ mt: 4 }}
//                 // justifyContent={"center"}
//                 // display={"flex"}
//                 // flexDirection={"column"}
//                 // // width={600}
//                 // maxWidth="sm"
//               >
//                 {/* <Typography
//                   variant="h4"
//                   textAlign={"center"}
//                   sx={{ display: "flex" }}
//                 >
//                   Welcome to Tuition Highway
//                 </Typography> */}
//                 {/* <Typography
//                   variant="subtitle2"
//                   sx={{ mb: 4, mt: 3 }}
//                   textAlign={"center"}
//                 >
//                   Tuition Highway started in 2017 to meet the demand for
//                   flexible online tutoring. With our experienced and qualified
//                   faculty from around the world, we provide one-to-one and group
//                   online lessons to help improve grades, fill gaps in learning,
//                   and boost future chances.
//                 </Typography> */}
//                 {/* <Typography variant="subtitle2" sx={{ mb: 4, mt: 3 }}>
//                   For Teachers: Connect and teach with ease. Find your class
//                   links and manage your teaching schedule. Our platform is your
//                   assistant, helping you focus on what you do best - teaching.
//                 </Typography>
//                 <Typography variant="subtitle2" sx={{ mb: 4, mt: 3 }}>
//                   For Admins: Oversee and steer the educational experience. Your
//                   comprehensive dashboard allows for efficient management of
//                   classes, teachers, and student engagements.
//                 </Typography>
//                 <Typography variant="subtitle2" sx={{ mb: 4, mt: 3 }}>
//                   Need Help? We're here to assist. Contact our support team for
//                   any queries or guidance.
//                 </Typography> */}
//               </Box>
//             )}
//           </Box>
//         </Box>
//       </Box>
//       <Box
//         sx={{
//           backgroundColor: "background.paper",
//           display: "flex",
//           flex: {
//             xs: "1 1 auto",
//             md: "0 0 auto",
//           },
//           flexDirection: "column",
//           justifyContent: {
//             md: "center",
//           },
//           maxWidth: "100%",
//           p: {
//             xs: 4,
//             md: 8,
//           },
//           width: {
//             md: 600,
//           },
//         }}
//       >
//         <div>{children}</div>
//       </Box>
//     </Box>
//   );

//   return <GuestGuard>{component}</GuestGuard>;
// };

// AuthLayout.propTypes = {
//   children: PropTypes.node,
// };

import type { FC, ReactNode } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";

import { GuestGuard } from "src/components";

const TOP_NAV_HEIGHT = 64;

const LayoutRoot = styled("div")(({ theme }) => ({
  backgroundColor: "#e8f0fc",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "top center",
  backgroundImage: 'url("/assets/gradient-bg.svg")',
  display: "flex",
  flex: "1 1 auto",
  flexDirection: "column",
  height: "100%",
}));

interface LayoutProps {
  children: ReactNode;
}

export const AuthLayout: FC<LayoutProps> = (props) => {
  const { children } = props;

  return (
    <GuestGuard>
      <LayoutRoot>
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            justifyContent: "center",
            flex: "1 1 auto",
          }}
        >
          <Container
            maxWidth="sm"
            sx={{
              py: {
                xs: "60px",
                md: "120px",
              },
            }}
          >
            {children}
          </Container>
        </Box>
      </LayoutRoot>
    </GuestGuard>
  );
};

AuthLayout.propTypes = {
  children: PropTypes.node,
};
