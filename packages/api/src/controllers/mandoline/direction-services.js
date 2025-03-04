const { User, Direction, Service } = require("~/models");
const { isDirection } = require("@emjpm/biz");

const getDirectionServices = async (req, res) => {
  const {
    locals: {
      oauth: { token },
    },
  } = res;
  const {
    user: { id: userId },
  } = token;

  let user;
  try {
    user = await User.query().findById(userId);
  } catch (error) {
    return res.status(422).json({
      errors: [{ error: `${error}` }],
    });
  }

  if (!user) {
    return res.status(400).json({
      errors: [{ error: `no user find for this token` }],
    });
  }

  if (!isDirection(user)) {
    return res.status(422).json({
      errors: [
        { error: "this api is only allowed for user of type 'direction'" },
      ],
    });
  }

  let error;
  let direction;
  try {
    [direction] = await Direction.query()
      .where("user_id", userId)
      .withGraphFetched(
        "[departement_services.[departement], region_services.[departement]]"
      );
    if (!direction) {
      error = "user's direction undefined";
    }
  } catch (err) {
    error = err;
  }
  if (error) {
    return res.status(422).json({
      errors: [{ error: `${error}` }],
    });
  }

  let services;
  try {
    const { type: directionType } = direction;
    switch (directionType) {
      case "national":
        services = await Service.query().select();
        break;
      case "departemental":
        services = direction.departement_services;
        break;
      case "regional":
        services = direction.region_services;
        break;
      default:
        throw new Error(
          "unexpected type '" + directionType + "' for direction"
        );
    }
  } catch (err) {
    error = err;
  }
  if (error) {
    return res.status(422).json({
      errors: [{ error: `${error}` }],
    });
  }

  return res.status(200).json(services);
};

module.exports = { getDirectionServices };
